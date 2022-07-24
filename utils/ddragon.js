const fetch = require('node-fetch');
const domain = 'http://ddragon.leagueoflegends.com';
const getLatestVersion = async () => {
  const response = await fetch(`${domain}/api/versions.json`);
  const versions = await response.json();
  return versions[0];
}

module.exports = {
  getAllChampions: async () => {
    const ver = await getLatestVersion();
    const url = `${domain}/cdn/${ver}/data/en_US/champion.json`
    const response = await fetch(url);
    const champions = await response.json();
    return Object.values(champions.data);
  }
}