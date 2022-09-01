// Shorthand function for query selector
const $ = (sel) => document.querySelector(sel);

// On document ready
const init = async () => {
  // Display bot stats on page
  try {
    const apiResponse = await fetch('/stats');
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
  const { prefix, slash_commands, regular_commands } = commands;
  $('#slash-commands').innerHTML =
    '<h2 class="text-center text-md-start">Slash Commands</h2>' +
    slash_commands.map(s => createSlashCommandDoc(s)).join('\n');
  $('.slash-command-navlist').innerHTML = slash_commands.map(s => createCommandNav(s)).join('\n');
  $('#regular-commands').innerHTML =
    '<h2 class="text-center text-md-start">Regular Commands</h2>' +
    regular_commands.map(c => createRegularCommandDoc(c, prefix)).join('\n');
  $('.regular-command-navlist').innerHTML = regular_commands.map(c => createCommandNav(c, false)).join('\n');
}

const createCommandNav = ({ name, command }, isSlash = true) => {
  return `<li>
  <a class="d-inline-flex align-items-center rounded text-decoration-none" href="#${isSlash ? 'slash' : 'cmd'}-${command}">
    ${name}
  </a>
</li>`
}

const createSlashCommandDoc = (slashCmd) => {
  const createSubcommandDoc = (subcommand, parent) => {
    const { command, description, options, image } = subcommand;
    return `<div class="d-flex flex-column flex-md-row mb-5">
    <code class="command-syntax col-md-3 mb-2">/${parent}${command ? ` ${command}` : ''}</code>
    <div class="command-details col-md-9">
      <div class="row">
        <p class="col-md-3 col-lg-2 fw-semibold">Description:</p>
        <p class="col-md-9 col-lg-10">${description}</p>
      </div>
      <div class="row">
        ${options.length ?
        `<p class="col-md-3 col-lg-2 fw-semibold">Options:</p>
        <ul class="list-unstyled col-md-9 col-lg-10">
          ${options.map(o => createOptionDoc(o)).join('\n')}
        </ul>` : ''}
      </div>
      <div class="row">
        <p class="col-md-3 col-lg-2 fw-semibold">Example:</p>
        <img class="col-md-9 col-lg-10" src="./assets/${image.file}" alt="${image.alt}">
      </div>
    </div>
  </div>`
  }

  const createOptionDoc = (option) => {
    const { name, description, required } = option;
    return `<li class="d-flex">
    <div class="col-md-5 col-lg-3">
      <code class="command-option">
        ${name}
        ${required ? `<small class="ps-2 pe-3 text-danger">required</small>` : ''}
      </code>
    </div>
    <div class="col-md-7 col-lg-9">
      <small>${description}</small>
    </div>
  </li>`
  }

  const { name, command, command_data, subcommands } = slashCmd;

  return `<div class="command mt-4 px-3 px-md-0">
  <h4 id="slash-${command}" class="mb-3">${name}</h4>
    ${command_data ?
      createSubcommandDoc(command_data, command) :
      subcommands.map(s => createSubcommandDoc(s, command)).join('\n')}
  </div>`
}

const createRegularCommandDoc = (cmd, prefix) => {
  const { name, command, description, image } = cmd;

  return `<div class="command mt-4 px-3 px-md-0">
  <h4 id="cmd-${command}" class="mb-3">${name}</h4>
  <div class="d-flex flex-column flex-md-row">
    <code class="command-syntax col-md-3 mb-2">${prefix}${command}</code>
      <div class="command-details col-md-9">
        <div class="row">
          <p class="col-md-3 col-lg-2 fw-semibold">Description:</p>
          <p class="col-md-9 col-lg-10">${description}</p>
        </div>
        <div class="row">
          <p class="col-md-3 col-lg-2 fw-semibold">Example:</p>
          <img class="col-md-9 col-lg-10" src="/assets/${image.file}" alt="${image.alt.replaceAll('{PREFIX}', prefix)}">
        </div>
      </div>
    </div>
  </div>`
}

init();