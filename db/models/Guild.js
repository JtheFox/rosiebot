const { Schema, model } = require('mongoose');

const Guild = model(
  'Guild',
  new Schema({
    guildId: {
      type: String,
      required: true,
      unique: true,
    },
    prefix: {
      type: String,
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
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
  })
);

module.exports = Guild;