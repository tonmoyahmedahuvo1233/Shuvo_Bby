const EcoData = require("./economyData");

module.exports.config = {
  name: "balance",
  version: "1.0",
  hasPermssion: 0,
  credits: "GPT",
  description: "Check your Coins & EXP",
  commandCategory: "economy",
  usages: "",
  cooldowns: 3
};

module.exports.run = async function({ api, event, Users }) {
  const userID = event.senderID;
  const userData = await EcoData.get(userID, Users);

  return api.sendMessage(
    `💰 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 💰\n\n👤 User: You\n🪙 Coins: ${userData.money}\n🌟 EXP: ${userData.exp}`,
    event.threadID, event.messageID
  );
};
