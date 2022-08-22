const axios = require('axios');
const domain = 'http://ddragon.leagueoflegends.com';

module.exports = {
  getLatestVersion: async () => {
    const res = await axios.get(`${domain}/api/versions.json`);
    return res.data[0];
  },
  getAllChampions: async () => {
    const res = await axios.get(`${domain}/cdn/${global.ddragVersion}/data/en_US/champion.json`);
    return Object.values(res.data.data);
  }
}