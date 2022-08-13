const { isAdmin } = require('../utils/helpers');
const logger = require('../utils/logger');
const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
  const bet = client.container.bets.get(message.guild.id);

  switch (flags[0]) {
    case 'c':
    case 'create':
    case 'start':
    case 'new':
      
  }
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
  constructor(name, optionOne, optionTwo, ownerId, displayMsg) {
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
    this.betOwner = ownerId;
    this.display = displayMsg;
    this.display.edit(this.#getEmbed());
  }

  #getEmbed() {
    return;
  }

  #getResultEmbed() {
    return;
  }

  #updateEmbed() {
    this.display.edit(this.#getEmbed());
  }

  isBetAdmin(member) {
    return (this.betOwner === member.id || isAdmin(member));
  }

  closeBet() {
    if (!this.open) return false;
    this.open = false;
    this.#updateEmbed();
    return true;
  }

  endBet(winner) {
    switch (winner) {
      case undefined:
        this.active = false;
        this.#updateEmbed();
        return true;
      case 1:
        this.active = false;
        this.winner = this.optionOne.name;
        this.#updateEmbed();
        return [this.#getResultEmbed(), this.optionOne.betters, this.optionTwo.betters];
      case 2:
        this.active = false;
        this.winner = this.optionTwo.name;
        this.display.edit(this.#getEmbed());
        return [this.#getResultEmbed(), this.optionTwo.betters, this.optionOne.betters];
      default:
        return false;
    }
  }
}