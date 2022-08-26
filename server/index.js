const logger = require('../utils/logger');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

exports.start = async (client) => {
  if (!client) throw new Error('No client provided');

  app.get('/', (req, res) => {
    res.redirect('https://github.com/JtheFox/rosiebot');
  });

  app.get('/statistics', (req, res) => {
    console.log(client.users)
    res.status(200).json({
      users: client.users.cache.size,
      servers: client.guilds.cache.size
    });
  });

  app.listen(PORT, () => logger.ready('Now listening'));
}