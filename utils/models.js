const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, required: true },
});

const Guild = model('Guild', guildSchema)

module.exports = { Guild };