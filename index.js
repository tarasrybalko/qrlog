const express = require('express');
const axios = require('axios');
const app = express();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.get('/qr', async (req, res) => {
  const userAgent = req.headers['user-agent'];
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const geo = await axios.get(`https://ipapi.co/${ip}/json/`).then(r => r.data).catch(() => ({}));
  const now = new Date().toISOString();

  const message = `
📥 QR Code Scanned!
🕒 Time: ${now}
🌐 IP: ${ip}
📍 Location: ${geo.city || 'Unknown'}, ${geo.country_name || ''}
📱 Device: ${userAgent}
  `;

  await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message
  }).catch(err => console.error('Telegram error:', err.response?.data || err.message));

  // перенаправление пользователя (можно заменить на свою ссылку)
  res.redirect('https://example.com/thanks');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
