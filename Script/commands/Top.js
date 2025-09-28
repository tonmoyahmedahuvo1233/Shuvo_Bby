const EcoData = require("./economyData");

module.exports.config = {
  name: "top",
  version: "1.0",
  hasPermssion: 0,
  credits: "GPT",
  description: "Show Top 10 users by Coins",
  commandCategory: "economy",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event, Users }) {
  const allUsers = EcoData.getAll();
  const sorted = Object.keys(allUsers)
    .map(uid => ({ userID: uid, money: allUsers[uid].money || 0 }))
    .sort((a,b) => b.money - a.money)
    .slice(0,10);

  let msg = `🏆 𝗧𝗢𝗣 10 𝗨𝗦𝗘𝗥𝗦 𝗕𝗬 𝗖𝗢𝗜𝗡𝗦 🏆\n\n`;
  for (let i=0;i<sorted.length;i++){
    const name = await Users.getNameUser(sorted[i].userID);
    msg += `${i+1}. ${name} — ${sorted[i].money} 💵\n`;
  }

  return api.sendMessage(msg, event.threadID, event.messageID);
};
