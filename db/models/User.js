const { Schema, model } = require('mongoose');

const User = model(
  'User',
  new Schema({
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    guilds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Guild'
      }
    ],
  })
);

module.exports = User;