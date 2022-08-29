const logger = require('../utils/logger');
const axios = require('axios');
const app = require('express')();
const PORT = process.env.PORT || 3000;
const token = process.env.BOT_TOKEN;

const discordApiConfig = { headers: { Authorization: `Bot ${token}` } };
const discordApiUrl = 'https://discord.com/api/v9';

app.get('/', (req, res) => {
  res.redirect('https://github.com/JtheFox/rosiebot');
});

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

app.listen(PORT, () => logger.ready('Sever is now listening'));
