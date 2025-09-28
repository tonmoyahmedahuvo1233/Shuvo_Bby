module.exports.config = {
  name: "top",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "GPT",
  description: "Show top users by Coins",
  commandCategory: "economy",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const allUsers = await Users.getAll();
    const sortedUsers = allUsers.sort((a, b) => (b.money || 0) - (a.money || 0));
    const top10 = sortedUsers.slice(0, 10);

    let msg = `🏆 𝗧𝗢𝗣 10 𝗨𝗦𝗘𝗥𝗦 𝗕𝗬 𝗖𝗢𝗜𝗡𝗦 🏆\n\n`;
    for (let i = 0; i < top10.length; i++) {
      const user = top10[i];
      const name = await Users.getNameUser(user.userID);
      const coins = user.money || 0;
      msg += `${i + 1}. ${name} — ${coins} 💵\n`;
    }

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
  }
};
