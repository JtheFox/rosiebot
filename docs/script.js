// Bot API
const botApiUrl = 'https://rosie-bot.herokuapp.com/stats';

// Shorthand function for query selector
const $ = (sel) => document.querySelector(sel);

// On document ready
const init = async () => {
  // Display bot stats on page
  try {
    const apiResponse = await fetch(botApiUrl);
    if (apiResponse.ok) {
      const botStats = await apiResponse.json();
      $('#bot-status').dataset.status = 'online';
      $('#bot-users').textContent = botStats.users;
      $('#bot-servers').textContent = botStats.servers;
    } else $('#bot-status').dataset.status = 'offline';
  } catch (err) {
    $('#bot-status').dataset.status = 'offline';
  }

  // Load command data
  const response = await fetch('./commands.json');
  const commands = await response.json();
  const { slash_commands, regular_commands } = commands;
  $('#slash-commands').innerHTML = slash_commands.map(s => createSlashCommandDoc(s)).join('\n');
  $('.slash-command-navlist').innerHTML = slash_commands.map(s => createSlashCommandNav(s)).join('\n');
}

const createSlashCommandNav = ({ name, command }) => {
  return `<li>
  <a class="d-inline-flex align-items-center rounded text-decoration-none" href="#slash-${command}">
    ${name}
  </a>
</li>`
}

const createSlashCommandDoc = (slashCmd) => {
  const createSubcommandDoc = (subcommand, parent) => {
    const { name, description, options, image } = subcommand;
    return `<div class="d-flex flex-column flex-md-row">
    <code class="command-syntax col-3">/${parent} ${name}</code>
    <div class="command-details col-9">
      <div class="row">
        <p class="col-2 fw-semibold">Description:</p>
        <p class="col-10">${description}</p>
      </div>
      <div class="row">
        ${options.length ?
        `<p class="col-2 fw-semibold">Options:</p>
        <ul class="list-unstyled col-10">
          ${options.map(o => createOptionDoc(o)).join('\n')}
        </ul>` : ''}
        <div class="row">
          <p class="col-2 fw-semibold">Example:</p>
          <img class="col-7" src="../assets/examples/${image.file}" alt="${image.alt}">
        </div>
      </div>
    </div>
  </div>`
  }

  const createOptionDoc = (option) => {
    const { name, description, required } = option;
    return `<li class="d-flex">
    <div class="col-3">
      <code class="command-option">
        ${name}
        ${required ? `<small class="ps-2 pe-3 text-danger">required</small>` : ''}
      </code>
    </div>
    <div class="col-9">
      <small>${description}</small>
    </div>
  </li>`
  }

  const { name, command, subcommands } = slashCmd;

  return `<div class="command mt-4">
  <h4 id="slash-${command}" class="mb-3">${name}</h4>
    ${subcommands.map(s => createSubcommandDoc(s, command)).join('\n')}
  </div>`
}

init();