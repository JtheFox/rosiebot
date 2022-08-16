const inquirer = require('inquirer');

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
  }
}