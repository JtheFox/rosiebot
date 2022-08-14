const { isAdmin, pluralize } = require('../utils/helpers');
const logger = require('../utils/logger');
const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
  // Initialize and descture variables
  const betId = message.guild.id;
  let bet = global.bets.get(betId);
  const { prefix, embedColor } = message.settings;
  const [action, ...ops] = args;

  try {
    // Check that the bet is active and open for betting
    const addBetPrecheck = () => {
      if (!bet?.isActive()) throw new Error('There is no active bet, create a new one to start betting');
      if (!bet.isOpen()) throw new Error('Betting has been closed');
    }

    // React to message to show operation was successful
    const betSuccess = () => {
      message.react('✅');
    }

    // Create cases for all bet command actrions and aliases
    switch (action) {
      case 'create':
      case 'start':
      case 'new':
        // Check for active bet
        if (bet && bet.isActive()) throw new Error('The active bet must be ended before creating a new one')
        // Destructure bet creation operands
        const [name, one, two] = ops.join(' ').split(',');
        // Check for valid bet creation criteria
        if (!(name && one && two)) throw new Error(`Invalid command usage, use \`${prefix}help bet\` for more information`);
        // Create new bet object
        const disp = await message.channel.send({ embeds: [new EmbedBuilder().setColor(embedColor).setTitle('Creating bet...')] });
        bet = new Bet(name, one, two, message.author, disp, embedColor)
        break;
      case 'cancel':
        bet.endBet();
        break;
      case 'end':
      case 'finish':
        // Check for active bet
        if (!bet?.isActive()) throw new Error('There is no active bet to end');
        const winner = typeof ops[0] === 'string' ? parseInt(ops[0]) : null;
        logger.log(winner)
        if (!winner || (winner !== 1 && winner !== 2)) throw new Error('A valid winner must be given (1 or 2)');
        bet.endBet(winner);
        break;
      case 'one':
      case '1':
        addBetPrecheck();
        bet.addBet(1, message.author.id);
        betSuccess();
        break;
      case 'two':
      case '2':
        addBetPrecheck();
        bet.addBet(2, message.author.id);
        betSuccess();
        break;
      default:
        throw new Error('No action specified');
    }
  } catch (err) {
    logger.warn(err.message);
    message.reply(`❌ ${err.message}`);
  }

  global.bets.set(betId, bet)
};

exports.config = {
  name: 'bet',
  alias: ['b'],
  description: '',
  usage: '',
  enabled: true,
  guildOnly: true,
  permLevel: 'User',
};

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

  constructor(name, optionOne, optionTwo, member, msg, color, closeDelay = 120000) {
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
    setTimeout(() => {
      this.closeBet();
      this.updateEmbed();
      this.display.channel.send({ embeds: [new EmbedBuilder().setTitle(this.name).setDescription('Betting is now closed')] });
    }, closeDelay);
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
          value: `${this.getBetters(1).length} better${pluralize(this.getBetters(1).length)}`
        },
        {
          name: `2️⃣ ${this.optionTwo.name}`,
          value: `${this.getBetters(2).length} better${pluralize(this.getBetters(2).length)}`
        }
      )
  }

  getResultEmbed(option) {
    const winBetters = this.getBetters(option).length;
    return new EmbedBuilder()
      .setColor(this.embedColor)
      .setTitle(this.name)
      .setDescription(`Winner: ${this.winner} with ${winBetters} better${pluralize(pluralize(winBetters))}`)
  }

  updateEmbed() {
    this.display.edit({ embeds: [this.getEmbed()] });
  }

  isBetAdmin(member) {
    return (this.betOwner.id === member.id || isAdmin(member));
  }

  isActive() {
    return this.active;
  }

  isOpen() {
    return this.open;
  }

  closeBet() {
    this.open = false;
  }

  addBet(option, memberId) {
    if (this.getBetters(1).includes(memberId) || this.getBetters(2).includes(memberId))
      throw new Error('You may only bet once');
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
        return [this.getResultEmbed(1), this.getBetters(1), this.getBetters(2)];
      case 2:
        this.closeBet();
        this.active = false;
        this.winner = this.optionTwo.name;
        this.updateEmbed();
        return [this.getResultEmbed(2), this.getBetters(2), this.getBetters(1)];
      default:
        return false;
    }
  }
}