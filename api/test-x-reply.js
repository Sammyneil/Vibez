// Temporary, read-only X reply diagnostic.
// Preview deployments only. This route never writes to Supabase or airdrop storage.
const OFFICIAL_LAUNCH_POST_ID = '2125564862365364671';

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

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, private, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Hard stop outside Vercel Preview; this diagnostic must never be exposed in production.
  if (process.env.VERCEL_ENV !== 'preview') {
    return res.status(404).json({ verified: false, error: 'Not found.' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ verified: false, error: 'Method not allowed.' });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return res.status(403).json({ verified: false, error: 'Cross-origin request denied.' });
      }
    } catch {
      return res.status(403).json({ verified: false, error: 'Invalid request origin.' });
    }
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  if (JSON.stringify(body).length > 2048) {
    return res.status(413).json({ verified: false, error: 'Request too large.' });
  }

  const parsed = parseCommentUrl(typeof body.commentUrl === 'string' ? body.commentUrl.trim() : '');
  if (!parsed) {
    return res.status(400).json({ verified: false, error: 'Provide a valid X post URL.' });
  }

  const bearerToken = process.env.X_API_BEARER_TOKEN || '';
  if (!bearerToken) {
    return res.status(503).json({ verified: false, error: 'X API verification is not configured.' });
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
      return res.status(200).json({ verified: false, code: 'POST_NOT_FOUND', message: 'The X post could not be found.' });
    }
    if (response.status === 401 || response.status === 403) {
      console.error('X diagnostic API credentials rejected:', response.status);
      return res.status(503).json({ verified: false, error: 'X API credentials were rejected or lack access.' });
    }
    if (response.status === 429 || response.status >= 500) {
      return res.status(503).json({ verified: false, error: 'X API is temporarily unavailable or rate limited.' });
    }
    if (!response.ok) {
      console.error('X diagnostic request failed:', response.status);
      return res.status(502).json({ verified: false, error: 'X post verification request failed.' });
    }

    const payload = await response.json();
    const tweet = payload && payload.data;
    const references = tweet && Array.isArray(tweet.referenced_tweets) ? tweet.referenced_tweets : [];
    const repliedTo = references.find((reference) => reference.type === 'replied_to');
    const users = payload && payload.includes && Array.isArray(payload.includes.users) ? payload.includes.users : [];
    const author = tweet ? users.find((user) => user.id === tweet.author_id) : null;

    if (!tweet) {
      return res.status(200).json({ verified: false, code: 'POST_NOT_FOUND', message: 'The X API returned no post data.' });
    }
    if (!author || typeof author.username !== 'string' ||
        author.username.toLowerCase() !== parsed.username.toLowerCase()) {
      return res.status(200).json({ verified: false, code: 'AUTHOR_MISMATCH', message: 'The URL username does not match the post author.' });
    }
    if (!repliedTo || repliedTo.id !== OFFICIAL_LAUNCH_POST_ID) {
      return res.status(200).json({ verified: false, code: 'NOT_DIRECT_REPLY', message: 'The post is not a direct reply to the official Vibez launch post.' });
    }

    return res.status(200).json({
      verified: true,
      code: 'DIRECT_REPLY_CONFIRMED',
      message: 'The post is a direct reply to the official Vibez launch post and the author matches the URL.'
    });
  } catch (error) {
    console.error('X diagnostic request failed:', error && error.message);
    return res.status(503).json({ verified: false, error: 'X API verification is temporarily unavailable.' });
  }
};

function safeParse(value) {
  try { return JSON.parse(value); } catch { return {}; }
}
