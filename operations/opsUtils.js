const inquirer = require('inquirer');
const logger = require('../utils/logger.js');

module.exports = {
  // Get and return a single user input
  promptInput: async (msg = 'Enter a value') => {
    const input = await inquirer.prompt({
      type: 'input',
      name: 'value',
      message: msg + ':'
    });
    return input.value;
  },
  // Require user to press enter to continue
  promptContinue: async () => {
    await inquirer.prompt({
      type: 'input',
      name: 'value',
      message: 'Press enter to continue'
    });
  },
  // Paginate array of results
  paginate: (arr, limit) => {
    if (arr.length <= limit) return [arr]
    return arr.reduce((acc, val, index) => {
      const pageIndex = Math.floor(index / limit);
      const page = acc[pageIndex] || (acc[pageIndex] = []);
      page.push(val);
      return acc;
    }, []);
  },
  // Input-based page navigation
  navigatePages: async (pages) => {
    if (pages.length < 2) {
      await this.promptContinue();
      return;
    }
    
  }
}