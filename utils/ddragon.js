const fetch = require('node-fetch');
const domain = 'http://ddragon.leagueoflegends.com';
const getLatestVersion = async () => {
  const versions = await fetch(`${domain}/api/versions.json`);
  return versions[0];
}

module.exports = {
  getAllChampions: async () => {
    const ver = await getLatestVersion();
    const response = await fetch(`${domain}/cdn/${ver}/data/en_US/champions.json`);
    return [...response.data.values()];
  }
}