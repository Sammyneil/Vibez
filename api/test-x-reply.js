const crypto = require('crypto');
const { verifyXReply } = require('./submit');

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const expected = process.env.VIBEZ_TEST_ROUTE_SECRET || '';
  const supplied = req.headers['x-vibez-test-secret'];
  if (!expected || !safeEqual(supplied, expected)) {
    return res.status(404).json({ ok: false, error: 'Not found.' });
  }

  const body = typeof req.body === 'string' ? (() => {
    try { return JSON.parse(req.body); } catch { return {}; }
  })() : (req.body || {});
  if (JSON.stringify(body).length > 4000) {
    return res.status(413).json({ ok: false, error: 'Request is too large.' });
  }
  const commentUrl = typeof body.commentUrl === 'string' ? body.commentUrl.trim() : '';
  if (!commentUrl) {
    return res.status(400).json({ ok: false, error: 'commentUrl is required.' });
  }

  const result = await verifyXReply(commentUrl);
  if (!result.ok) {
    return res.status(result.status).json({ ok: false, verified: false, error: result.error });
  }
  return res.status(200).json({ ok: true, verified: true, persisted: false });
};
