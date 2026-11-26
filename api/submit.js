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

function validCommentUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^(www|mobile)\./, '');
    return (host === 'x.com' || host === 'twitter.com') &&
      /^\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}(?:\/.*)?$/.test(url.pathname);
  } catch {
    return false;
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
  if (!validCommentUrl(commentUrl)) {
    return res.status(400).json({ ok: false, error: 'Please provide a valid X comment link.' });
  }
  if (body.consent !== true) {
    return res.status(400).json({ ok: false, error: 'Consent is required to submit your entry.' });
  }

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const telegramChatId = process.env.TELEGRAM_CHAT_ID || '@vibecoinonsoll';
  if (!telegramToken || !isValidTelegramLogin(body.telegramAuth, telegramToken)) {
    return res.status(401).json({ ok: false, error: 'Please complete Telegram verification again before submitting.' });
  }
  try {
    const member = await isTelegramMember(telegramToken, telegramChatId, body.telegramAuth.id);
    if (!member) return res.status(403).json({ ok: false, error: 'Telegram channel membership could not be confirmed.' });
  } catch (error) {
    console.error('Telegram submission verification failed:', error && error.message);
    return res.status(502).json({ ok: false, error: 'Could not verify Telegram membership. Please try again.' });
  }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  const secretKey = process.env.SUPABASE_SECRET_KEY || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const apiKey = secretKey || serviceRoleKey;
  if (!supabaseUrl || !apiKey) {
    return res.status(503).json({ ok: false, error: 'Participant storage is not configured. Please try again later.' });
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
