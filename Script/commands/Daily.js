const EcoData = require("./economyData");

module.exports.config = {
  name: "daily",
  version: "1.0",
  hasPermssion: 0,
  credits: "GPT",
  description: "Claim daily Coins & EXP",
  commandCategory: "economy",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event, Users }) {
  const userID = event.senderID;
  const userData = await EcoData.get(userID, Users);

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (now - userData.lastDaily < oneDay) {
    const remaining = oneDay - (now - userData.lastDaily);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return api.sendMessage(`⏳ Already claimed! Next claim in: ${hours}h ${minutes}m ${seconds}s`, event.threadID, event.messageID);
  }

  const rewardCoins = 500;
  const rewardExp = 200;

  userData.money += rewardCoins;
  userData.exp += rewardExp;
  userData.lastDaily = now;

  await EcoData.set(userID, Users, userData);

  return api.sendMessage(`🎉 Daily Reward Claimed!\n🪙 Coins: ${rewardCoins}\n🌟 EXP: ${rewardExp}`, event.threadID, event.messageID);
};
