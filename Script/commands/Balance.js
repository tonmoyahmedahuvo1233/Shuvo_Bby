const usersData = require("../database/usersData");

module.exports.config = {
  name: "balance",
  aliases: ["bal"],
  version: "1.0",
  author: "ChatGPT × Akash",
  countDown: 5,
  role: 0,
  description: "Check your balance"
};

module.exports.run = async function({ api, event }) {
  const mention = Object.keys(event.mentions)[0];
  const uid = mention || event.senderID;
  const user = usersData.getUser(uid);

  if (mention) {
    return api.sendMessage(
      `${event.mentions[mention]} এর ব্যালেন্স: ${user.money} কয়েন`,
      event.threadID
    );
  } else {
    return api.sendMessage(
      `💰 আপনার ব্যালেন্স: ${user.money} কয়েন`,
      event.threadID,
      event.messageID
    );
  }
};
