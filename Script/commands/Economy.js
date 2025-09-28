module.exports.config = {
  name: "eco",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Manage user economy data",
  commandCategory: "system",
  usages: "eco get/set [userID]",
  cooldowns: 3,
  dependencies: {}
};

module.exports.EcoDataModule = {
  EcoData: {},

  async get(userID, Users) {
    if (!this.EcoData[userID]) {
      const data = await Users.getData(userID) || {};
      this.EcoData[userID] = {
        money: data.money || 0,
        exp: data.exp || 0,
        lastDaily: data.lastDaily || 0,
        create: data.create || Date.now(),
        name: data.name || "Unknown",
        level: data.level || 1,
        items: data.items || []
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
