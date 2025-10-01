const usersData = require("../database/usersData");
const moment = require("moment-timezone");

module.exports.config = {
  name: "daily",
  version: "1.0",
  author: "ChatGPT × Akash",
  countDown: 5,
  role: 0,
  description: "Claim your daily reward"
};

module.exports.run = async function({ api, event }) {
  const user = usersData.getUser(event.senderID);
  const dateTime = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");

  if (user.data.lastDaily === dateTime)
    return api.sendMessage("⏰ আজকের daily reward আপনি নিয়ে নিয়েছেন!", event.threadID);

  const reward = 500;
  user.money += reward;
  user.data.lastDaily = dateTime;
  usersData.setUser(event.senderID, user);

  api.sendMessage(`🎁 আজকের reward: +${reward} কয়েন`, event.threadID);
};
