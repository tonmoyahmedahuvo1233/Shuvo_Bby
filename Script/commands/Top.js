module.exports.config = {
  name: "top",
  version: "1.0.1",
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
    const usersData = [];

    // ensure we only take users with money
    for (const user of allUsers) {
      const data = await Users.getData(user.userID);
      usersData.push({
        userID: user.userID,
        money: (data.money || 0)
      });
    }

    const sorted = usersData.sort((a, b) => b.money - a.money);
    const top10 = sorted.slice(0, 10);

    let msg = `🏆 𝗧𝗢𝗣 10 𝗨𝗦𝗘𝗥𝗦 𝗕𝗬 𝗖𝗢𝗜𝗡𝗦 🏆\n\n`;
    for (let i = 0; i < top10.length; i++) {
      const user = top10[i];
      const name = await Users.getNameUser(user.userID);
      msg += `${i + 1}. ${name} — ${user.money} 💵\n`;
    }

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
  }
};
