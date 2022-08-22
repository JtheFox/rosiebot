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
  },
  getAllItems: async () => {
    const res = await axios.get(`${domain}/cdn/${global.ddragVersion}/data/en_US/item.json`);
    const allItems = Object.values(res.data.data);
    return {
      boots: allItems.filter(({ tags, depth }) => tags.includes('Boots') && depth === 2),
      mythic: allItems.filter(({ description }) => description.includes('Mythic') && !description.includes('ornnBonus')),
      legendary: allItems.filter(({ description, depth }) => !description.includes('Mythic') && depth === 3)
    }
  },
}