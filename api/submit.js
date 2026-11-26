const crypto = require('crypto');
const MEMBER_STATUSES = new Set(['creator', 'administrator', 'member']);
const MAX_LOGIN_AGE_SECONDS = 24 * 60 * 60;

function isValidTelegramLogin(user, token) {
  if (!user || typeof user !== 'object' || typeof user.hash !== 'string') return false;
  const checkString = Object.keys(user)
    .filter((key) => key !== 'hash' && user[key] !== undefined && user[key] !== null)
    .sort()
    .map((key) => `${key}=${user[key]}`)
    .join('\n');
  const secret = crypto.createHash('sha256').update(token).digest();
  const expected = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  const given = Buffer.from(user.hash, 'utf8');
  const wanted = Buffer.from(expected, 'utf8');
  if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) return false;
  const age = Math.floor(Date.now() / 1000) - Number(user.auth_date);
  return Number.isFinite(age) && age >= 0 && age <= MAX_LOGIN_AGE_SECONDS;
}

async function isTelegramMember(token, chatId, userId) {
  const url = `https://api.telegram.org/bot${token}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${encodeURIComponent(userId)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || !data.ok) return false;
  return MEMBER_STATUSES.has(data.result.status) ||
    (data.result.status === 'restricted' && data.result.is_member === true);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function isSolanaAddress(value) {
  if (typeof value !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) return false;
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let decoded = 0n;
  for (const char of value) {
    const digit = alphabet.indexOf(char);
    if (digit < 0) return false;
    decoded = decoded * 58n + BigInt(digit);
  }
  let byteLength = 0;
  while (decoded > 0n) {
    byteLength++;
    decoded >>= 8n;
  }
  for (let i = 0; i < value.length && value[i] === '1'; i++) byteLength++;
  return byteLength === 32;
}

function parseCommentUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^(www|mobile)\./, '');
    const match = url.pathname.match(/^\/([A-Za-z0-9_]{1,15})\/status\/(\d{5,25})(?:\/.*)?$/);
    if ((host !== 'x.com' && host !== 'twitter.com') || !match) return null;
    return { username: match[1], id: match[2] };
  } catch {
    return null;
  }
}

async function verifyXReply(value) {
  const parsed = parseCommentUrl(value);
  if (!parsed) return { ok: false, status: 400, error: 'Please provide a valid X comment link.' };

  const bearerToken = process.env.X_API_BEARER_TOKEN || '';
  if (!bearerToken) {
    return { ok: false, status: 503, error: 'X reply verification is not configured yet. Please try again later.' };
  }

  const endpoint = new URL('https://api.x.com/2/tweets/' + encodeURIComponent(parsed.id));
  endpoint.searchParams.set('tweet.fields', 'author_id,referenced_tweets');
  endpoint.searchParams.set('expansions', 'author_id');
  endpoint.searchParams.set('user.fields', 'username');

  try {
    const response = await fetch(endpoint.toString(), {
      headers: { Authorization: 'Bearer ' + bearerToken }
    });
    if (response.status === 404) {
      return { ok: false, status: 400, error: 'That X post could not be found. Check the comment link and try again.' };
    }
    if (response.status === 401 || response.status === 403) {
      console.error('X API rejected the reply-verification credentials:', response.status);
      return { ok: false, status: 503, error: 'X reply verification is temporarily unavailable.' };
    }
    if (response.status === 429 || response.status >= 500) {
      return { ok: false, status: 503, error: 'X reply verification is temporarily unavailable. Please try again.' };
    }
    if (!response.ok) {
      console.error('X reply verification failed with status:', response.status);
      return { ok: false, status: 502, error: 'Could not verify that X reply. Please try again.' };
    }

    const payload = await response.json();
    const tweet = payload && payload.data;
    const repliedTo = tweet && Array.isArray(tweet.referenced_tweets)
      ? tweet.referenced_tweets.find((reference) => reference.type === 'replied_to')
      : null;
    const author = payload && payload.includes && Array.isArray(payload.includes.users)
      ? payload.includes.users.find((user) => user.id === tweet.author_id)
      : null;

    if (!tweet || !repliedTo || repliedTo.id !== '2125564862365364671') {
      return { ok: false, status: 400, error: 'Your X post must be a direct reply to the official Vibez launch post.' };
    }
    if (!author || author.username.toLowerCase() !== parsed.username.toLowerCase()) {
      return { ok: false, status: 400, error: 'The X username in your link does not match the post author.' };
    }
    return { ok: true };
  } catch (error) {
    console.error('X reply verification request failed:', error && error.message);
    return { ok: false, status: 503, error: 'X reply verification is temporarily unavailable. Please try again.' };
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return res.status(403).json({ ok: false, error: 'Cross-origin submission is not allowed.' });
      }
    } catch {
      return res.status(403).json({ ok: false, error: 'Invalid request origin.' });
    }
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  if (JSON.stringify(body).length > 12000) {
    return res.status(413).json({ ok: false, error: 'Submission is too large.' });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const walletAddress = typeof body.walletAddress === 'string' ? body.walletAddress.trim() : '';
  const commentUrl = typeof body.commentUrl === 'string' ? body.commentUrl.trim() : '';

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
  }
  if (!isSolanaAddress(walletAddress)) {
    return res.status(400).json({ ok: false, error: 'Please provide a valid Solana wallet address.' });
  }
  if (body.consent !== true) {
    return res.status(400).json({ ok: false, error: 'Consent is required to submit your entry.' });
  }

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const telegramChatId = process.env.TELEGRAM_CHAT_ID || '@vibecoinonsoll';
  if (!telegramToken || !isValidTelegramLogin(body.telegramAuth, telegramToken)) {
    return res.status(401).json({ ok: false, error: 'Please complete Telegram verification again before submitting.' });
  }
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  const secretKey = process.env.SUPABASE_SECRET_KEY || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const apiKey = secretKey || serviceRoleKey;
  const rateLimitSecret = process.env.RATE_LIMIT_SECRET || apiKey;
  if (!supabaseUrl || !apiKey || !rateLimitSecret) {
    return res.status(503).json({ ok: false, error: 'Submission protection is not configured. Please try again later.' });
  }

  // Hash identifiers before storage; raw IPs, Telegram IDs and wallets are never persisted.
  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = typeof req.headers['x-real-ip'] === 'string'
    ? req.headers['x-real-ip'].trim()
    : (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : '');
  if (!clientIp) {
    return res.status(503).json({ ok: false, error: 'Could not establish a trusted client address. Please try again.' });
  }
  const rateKey = (scope, value) => crypto.createHmac('sha256', rateLimitSecret)
    .update(scope + ':' + String(value))
    .digest('hex');
  try {
    const limitResponse = await fetch(supabaseUrl + '/rest/v1/rpc/consume_vibez_rate_limits', {
      method: 'POST',
      headers: {
        apikey: apiKey,
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        p_ip_key: rateKey('ip', clientIp),
        p_telegram_key: rateKey('telegram', body.telegramAuth.id),
        p_wallet_key: rateKey('wallet', walletAddress.toLowerCase())
      })
    });
    if (!limitResponse.ok) {
      console.error('Submission rate-limit service failed with status:', limitResponse.status);
      return res.status(503).json({ ok: false, error: 'Submission protection is temporarily unavailable. Please try again.' });
    }
    const rows = await limitResponse.json();
    const limit = Array.isArray(rows) ? rows[0] : rows;
    if (!limit || limit.allowed !== true) {
      const retryAfter = Math.max(1, Number(limit && limit.retry_after_seconds) || 60);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({ ok: false, error: 'Too many submission attempts. Please wait before trying again.', retryAfterSeconds: retryAfter });
    }
  } catch (error) {
    console.error('Submission rate-limit request failed:', error && error.message);
    return res.status(503).json({ ok: false, error: 'Submission protection is temporarily unavailable. Please try again.' });
  }

  try {
    const member = await isTelegramMember(telegramToken, telegramChatId, body.telegramAuth.id);
    if (!member) return res.status(403).json({ ok: false, error: 'Telegram channel membership could not be confirmed.' });
  } catch (error) {
    console.error('Telegram submission verification failed:', error && error.message);
    return res.status(502).json({ ok: false, error: 'Could not verify Telegram membership. Please try again.' });
  }

  // Only spend X API quota after consent and signed Telegram membership are verified.
  const xReply = await verifyXReply(commentUrl);
  if (!xReply.ok) {
    return res.status(xReply.status).json({ ok: false, error: xReply.error });
  }

  const record = {
    email,
    wallet_address: walletAddress,
    comment_url: commentUrl,
    x_follow_self_reported: body.xFollowSelfReported === true,
    x_like_repost_self_reported: body.xLikeRepostSelfReported === true,
    consent_at: new Date().toISOString()
  };

  try {
    const response = await fetch(
      supabaseUrl + '/rest/v1/airdrop_entries?on_conflict=wallet_address',
      {
        method: 'POST',
        headers: {
          apikey: apiKey,
          ...(secretKey ? {} : { Authorization: 'Bearer ' + apiKey }),
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(record)
      }
    );
    if (!response.ok) {
      console.error('Airdrop storage request failed with status:', response.status);
      return res.status(502).json({ ok: false, error: 'We could not save your entry. Please try again later.' });
    }
    return res.status(200).json({ ok: true, submittedAt: record.consent_at });
  } catch (error) {
    console.error('Airdrop storage request failed:', error && error.message);
    return res.status(502).json({ ok: false, error: 'We could not reach participant storage. Please try again later.' });
  }
};

function safeParse(text) {
  try { return JSON.parse(text); } catch { return {}; }
}

// Export the exact production verifier for the isolated, non-persistent test route.
module.exports.verifyXReply = verifyXReply;
