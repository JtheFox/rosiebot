const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  prefix: {
    type: String,
    required: true,
  },
  users: [{
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    betScore: {
      wins: Number,
      losses: Number
    },
  }],
  bet: new Schema({
    active: Boolean,
    title: String,
    option1: String,
    option2: String,
    users: [{
      userId: String,
      choice: Number,
    }]
  })
});

const Guild = model('Guild', guildSchema)

module.exports = { Guild };