const { isAdmin, pluralize } = require('../utils/helpers');
const logger = require('../utils/logger');
const { EmbedBuilder } = require('discord.js');

// TODO: Add close timer to bet create options
// TODO: Change /bet on 1 | 2 to button interface
// TODO: Add bet payouts
// TODO: Improve bet status indicators
// TODO: Improve bet result display
exports.run = async (client, interaction) => {
  // Initialize and descture variables
  const { embedColor } = interaction.settings;
  const { guildId, channelId, member, options } = interaction;
  let bet = global.bets.get(guildId) ?? { active: false, open: false };
  let replyIcon = '✅';
  let replyMsg = '';
  const setReply = (msg, error = false) => {
    replyIcon = error ? '❌' : '✅';
    replyMsg = msg;
  }

  try {
    switch (options._subcommand) {
      case 'create':
        if (bet.active) {
          setReply('There is already an active bet', true);
          break;
        }
        const [title, one, two] = options._hoistedOptions;
        const disp = await client.channels.cache.get(channelId).send({
          embeds: [new EmbedBuilder().setColor(embedColor).setTitle('Creating bet...')]
        });
        bet = new Bet(title.value, one.value, two.value, member, disp, embedColor);
        setReply('Bet created successfully');
        break;
      case 'close':
        if (!bet.active) {
          setReply('There must be an active bet to use this command', true);
          break;
        }
        if (!bet.open) {
          setReply('Betting has already been closed', true);
          break;
        }
        break;
      case 'cancel':
      case 'end':
        if (!bet.active) {
          setReply('There is no active bet to end', true);
          break;
        }
        const winner = options._hoistedOptions[0]?.value;
        bet.endBet(winner);
        setReply('Bet ended successfully');
        break;
      case 'on':
        if (!bet.active) {
          setReply('There is no active bet to bet on', true);
          break;
        }
        if (!bet.open) {
          setReply('Betting for this bet has been closed', true);
          break;
        }
        if (bet.memberHasBet(member.id)) {
          setReply('You have already placed a bet', true);
          break;
        }
        const [option] = options._hoistedOptions;
        bet.addBet(option.value, member.id);
        setReply('Bet placed successfully');
        break;
      default: throw new Error('Invalid subcommand');
    }
  } catch (err) {
    logger.error(err);
    errorMsg = 'An error occurred while running the command';
  }

  global.bets.set(guildId, bet);
  await interaction.reply({ content: `${replyIcon} ${replyMsg}`, ephemeral: true })
}

exports.cmd = {
  "name": "bet",
  "description": "Create/end a bet or participate in an active bet",
  "dm_permission": false,
  "options": [
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
    },
    {
      "type": 1,
      "name": "close",
      "description": "Close betting on the active bet",
      "options": []
    },
    {
      "type": 1,
      "name": "cancel",
      "description": "Cancel the active bet with no payout",
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
              "name": "1",
              "value": 1
            },
            {
              "name": "2",
              "value": 2
            }
          ],
          "required": true
        }
      ]
    },
  ],
}

class Bet {
  name;
  optionOne;
  optionTwo;
  open;
  active;
  winner;
  betOwner;
  display;
  embedColor;

  constructor(name, optionOne, optionTwo, member, msg, color, closeDelay = 1000 * 60 * 2) {
    this.name = name;
    this.optionOne = {
      name: optionOne,
      betters: []
    };
    this.optionTwo = {
      name: optionTwo,
      betters: []
    };
    this.open = true;
    this.active = true;
    this.winner = null;
    this.betOwner = member;
    this.display = msg;
    this.embedColor = color;
    this.updateEmbed();
    // Close bet after delay
    setTimeout(() => {
      if (!(this.active && this.open)) return
      this.closeBet();
      this.updateEmbed();
      this.display.channel.send({ embeds: [new EmbedBuilder().setTitle(this.name).setDescription('Betting is now closed')] });
    }, closeDelay);
    // Auto end bet if active after 2 hours
    setTimeout(() => {
      if (this.active) this.endBet();
    }, 1000 * 60 * 60 * 2)
  }

  getBetters(option) {
    return option === 1 ? this.optionOne.betters : this.optionTwo.betters
  }

  getEmbed() {
    const [activeStatus, bettingStatus] = [
      this.active ? 'Active' : 'Finished',
      this.open ? 'Open' : 'Closed'
    ]
    return new EmbedBuilder()
      .setColor(this.embedColor)
      .setTitle(this.name)
      .setDescription(`Status: ${activeStatus} | Betting: ${bettingStatus}`)
      .addFields(
        {
          name: `1️⃣ ${this.optionOne.name}`,
          value: `${this.getBetters(1).length} ${pluralize('better', this.getBetters(2))}`
        },
        {
          name: `2️⃣ ${this.optionTwo.name}`,
          value: `${this.getBetters(2).length} ${pluralize('better', this.getBetters(2))}`
        }
      )
  }

  postResultsEmbed(option) {
    const winBetters = this.getBetters(option).length;
    this.display.channel.send({
      embeds: [new EmbedBuilder()
        .setColor(this.embedColor)
        .setTitle(this.name)
        .setDescription(`Winner: **${this.winner}** with **${winBetters} ${pluralize('better', winBetters)}**`)
      ]
    })
  }

  updateEmbed() {
    this.display.edit({ embeds: [this.getEmbed()] });
  }

  isBetAdmin(member) {
    return (this.betOwner.id === member.id || isAdmin(member));
  }

  closeBet() {
    this.open = false;
  }

  memberHasBet(memberId) {
    return [...this.getBetters(1), ...this.getBetters(2)].includes(memberId);
  }

  addBet(option, memberId) {
    switch (option) {
      case undefined: throw new Error('No bet option provided');
      case 1:
        this.optionOne.betters.push(memberId);
        break;
      case 2:
        this.optionTwo.betters.push(memberId);
        break;
      default: throw new Error('Invalid bet option provided');
    }
    this.updateEmbed();
  }

  endBet(winner) {
    switch (winner) {
      case undefined:
        this.closeBet();
        this.active = false;
        this.updateEmbed();
        return true;
      case 1:
        this.closeBet();
        this.active = false;
        this.winner = this.optionOne.name;
        this.updateEmbed();
        this.postResultsEmbed(1);
        return [this.getBetters(1), this.getBetters(2)];
      case 2:
        this.closeBet();
        this.active = false;
        this.winner = this.optionTwo.name;
        this.updateEmbed();
        this.postResultsEmbed(2);
        return [this.getBetters(2), this.getBetters(1)];
      default:
        return false;
    }
  }
}