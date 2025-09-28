module.exports.config = {
  name: "daily",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "GPT",
  description: "Claim your daily Coins and EXP reward",
  commandCategory: "economy",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const userID = event.senderID;
    const userData = await Users.getData(userID);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!userData.lastDaily) userData.lastDaily = 0;

    if (now - userData.lastDaily < oneDay) {
      const remaining = oneDay - (now - userData.lastDaily);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      return api.sendMessage(
        `⏳ Already claimed!\nNext claim in: ${hours}h ${minutes}m ${seconds}s`,
        event.threadID,
        event.messageID
      );
    }

    const rewardCoins = 500;
    const rewardExp = 200;

    await Users.setData(userID, {
      money: (userData.money || 0) + rewardCoins,
      exp: (userData.exp || 0) + rewardExp,
      lastDaily: now
    });

    return api.sendMessage(
      `🎉 Daily Reward Claimed! 🎉\n🪙 Coins: ${rewardCoins}\n🌟 EXP: ${rewardExp}`,
      event.threadID,
      event.messageID
    );

  } catch (error) {
    console.error(error);
    return api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
  }
};
