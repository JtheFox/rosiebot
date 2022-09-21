const axios = require('axios');
const api = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/';

module.exports = {
  getAllChampions: async () => {
    const res = await axios.get(api + 'champion-summary.json');
    console.log(res.data);
    return Object.values(res.data);
  },
  getAllItems: async () => {
    const res = await axios.get(api + 'items.json');
    const allItems = Object.values(res.data);
    console.log(allItems);
    return {
      boots: allItems.filter(({ categories, priceTotal }) => categories.includes('Boots') && priceTotal > 300),
      mythic: allItems.filter(({ description }) => description.includes('Mythic') && !description.includes('ornnBonus')),
      legendary: allItems.filter(({ description, priceTotal }) => !description.includes('Mythic') && priceTotal > 2000)
    }
  },
}