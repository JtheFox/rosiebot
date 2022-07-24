const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, required: true },
  embedColor: { type: String, required: false, match: [/^#([a-f0-9]{6}|[a-f0-9]{3})$/i] }
});

const Guild = model('Guild', guildSchema)

module.exports = { Guild };