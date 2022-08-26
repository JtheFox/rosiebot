// Bot API
const botApiUrl = 'https://rosie-bot.herokuapp.com/stats';

// Shorthand function for query selector
const $ = (sel) => document.querySelector(sel);

// On document ready
(async () => {
  // Display bot stats on page
  const apiResponse = await fetch(botApiUrl);
  if (apiResponse.ok) {
    const botStats = await apiResponse.json();
    $('#bot-status').dataset.status = online;
    $('#bot-users').textContent = botStats.users;
    $('#bot-servers').textContent = botStats.servers;
  } else $('#bot-status').dataset.status = offline;
  
  // Load command data
  const response = await fetch('./commands.json');
  const commands = await response.json();
  console.log(commands);
})