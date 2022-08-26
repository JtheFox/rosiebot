const logger = require('../utils/logger');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

exports.start = async (client) => {
  app.get('/', (req, res) => {
    res.redirect('https://github.com/JtheFox/rosiebot');
  });

  app.get('/statistics', (req, res) => {
    const stats = {
      users: client.users.cache.size,
      servers: client.guilds.cache.size
    }
    res.status(200).json(stats)
  });
  
  app.listen(PORT, () => logger.ready('Now listening'));
}