const crypto = require('crypto');

const MAX_LOGIN_AGE_SECONDS = 24 * 60 * 60;
const MEMBER_STATUSES = new Set(['creator', 'administrator', 'member']);

function getConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  const chatId = process.env.TELEGRAM_CHAT_ID || '@vibecoinonsoll';
  const botId = token.split(':')[0];
  return { token, chatId, botId };
}

// https://core.telegram.org/widgets/login#checking-authorization
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

async function isChannelMember(token, chatId, userId) {
  const url = `https://api.telegram.org/bot${token}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${encodeURIComponent(userId)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.ok) return false;
  const member = data.result;
  return MEMBER_STATUSES.has(member.status) || (member.status === 'restricted' && member.is_member === true);
}

module.exports = async function handler(req, res) {
  const { token, chatId, botId } = getConfig();
  res.setHeader('Cache-Control', 'no-store');

  if (!token) {
    return res.status(503).json({ verified: false, error: 'Telegram verification is not configured.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ telegramBotId: botId });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ verified: false, error: 'Method not allowed.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  if (body.task !== 'tg') {
    return res.status(400).json({ verified: false, error: 'Only the Telegram task can be verified here.' });
  }
  if (!isValidTelegramLogin(body.telegram, token)) {
    return res.status(401).json({ verified: false, error: 'Telegram login could not be confirmed. Please log in again.' });
  }

  try {
    const verified = await isChannelMember(token, chatId, body.telegram.id);
    return res.status(200).json({ verified, telegramId: verified ? body.telegram.id : undefined });
  } catch (error) {
    console.error('Telegram getChatMember failed:', error);
    return res.status(502).json({ verified: false, error: 'Could not reach Telegram. Please try again.' });
  }
};

function safeParse(text) {
  try { return JSON.parse(text); } catch { return {}; }
}
