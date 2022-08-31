const logger = require('../utils/logger');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const token = process.env.BOT_TOKEN;

const discordApiConfig = { headers: { Authorization: `Bot ${token}` } };
const discordApiUrl = 'https://discord.com/api/v9';

app.use(cors());

// Routes
app.get('/', (req, res) => res.status(200).sendFile('index.html'));

app.get('/stats', async (req, res) => {
  let botUsers = 0;
  const botGuilds = await axios.get(`${discordApiUrl}/users/@me/guilds`, discordApiConfig);
  for await (let guild of botGuilds.data) {
    const guildRes = await axios.get(`${discordApiUrl}/guilds/${guild.id}/preview`, discordApiConfig);
    botUsers += guildRes.data.approximate_member_count;
  }

  res.status(200).json({
    users: botUsers,
    servers: botGuilds.data.length
  });
});

app.get('*', (req, res) => res.status(404).redirect('/'));

// Add static middleware
app.use(express.static(path.join(__dirname, '..', 'docs')));

app.listen(PORT, () => logger.ready('Sever is now listening'));
