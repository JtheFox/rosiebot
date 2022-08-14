const { isAdmin, pluralize } = require('../utils/helpers');
const logger = require('../utils/logger');
const { EmbedBuilder } = require('discord.js');

exports.run = async (client, interaction) => {
  logger.log(interaction);
}

exports.cmd = {
  "name": "bet",
  "description": "Create/end a bet or participate in an active bet",
  "dm_permission": false,
  "options": [
    {
      "type": 1,
      "name": "cancel",
      "description": "Cancel the active bet",
      "options": []
    },
    {
      "type": 1,
      "name": "end",
      "description": "End the bet with a winner",
      "options": [
        {
          "type": 4,
          "name": "winner",
          "description": "Number of the winning bet option",
          "choices": [
            {
              "name": "option1",
              "value": 1
            },
            {
              "name": "option1",
              "value": 1
            }
          ],
          "required": true
        }
      ]
    },
    {
      "type": 1,
      "name": "create",
      "description": "Create a new bet with a title and two options",
      "options": [
        {
          "type": 3,
          "name": "title",
          "description": "Title of the bet",
          "required": true,
          "choices": []
        },
        {
          "type": 3,
          "name": "option1",
          "description": "First bet option",
          "required": true,
          "choices": []
        },
        {
          "type": 3,
          "name": "option2",
          "description": "Second bet option",
          "required": true
        },
      ]
    },
    {
      "type": 1,
      "name": "on",
      "description": "Place a bet on the active bet",
      "options": [
        {
          "type": 4,
          "name": "option",
          "description": "Option to bet on",
          "required": true,
          "choices": [
            {
              "name": "1",
              "value": 1
            },
            {
              "name": "2",
              "value": 2
            }
          ]
        }
      ]
    }
  ],
}