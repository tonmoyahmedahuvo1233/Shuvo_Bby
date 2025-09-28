module.exports = {
  EcoData: {},

  async get(userID, Users) {
    if (!this.EcoData[userID]) {
      const data = await Users.getData(userID) || {};
      this.EcoData[userID] = {
        money: data.money || 0,
        exp: data.exp || 0,
        lastDaily: data.lastDaily || 0
      };
    }
    return this.EcoData[userID];
  },

  async set(userID, Users, newData) {
    this.EcoData[userID] = { ...this.EcoData[userID], ...newData };
    await Users.setData(userID, this.EcoData[userID]);
  },

  getAll() {
    return this.EcoData;
  }
};
