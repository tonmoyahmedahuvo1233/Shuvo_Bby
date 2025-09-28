module.exports.config = {
  name: "balance",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "GPT",
  description: "Check your total Coins and EXP",
  commandCategory: "economy",
  usages: "[tag/blank]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, Users }) {
  const mention = Object.keys(event.mentions)[0];
  const userID = mention || event.senderID;
  const name = mention ? event.mentions[mention].replace("@", "") : await Users.getNameUser(userID);

  const userData = await Users.getData(userID);
  const balance = userData.money || 0;
  const exp = userData.exp || 0;

  return api.sendMessage(
    `💰 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 💰\n\n👤 User: ${name}\n🪙 Coins: ${balance}\n🌟 EXP: ${exp}`,
    event.threadID,
    event.messageID
  );
};
