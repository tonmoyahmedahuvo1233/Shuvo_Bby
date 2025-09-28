const axios = require("axios");
const EcoData = require("./economyData");

async function getBaseApiUrl() {
  const res = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
  return res.data.api;
}

module.exports.config = {
  name: "quiz",
  version: "1.0",
  hasPermssion: 0,
  credits: "GPT",
  description: "Play a quiz in Bangla or English",
  commandCategory: "game",
  usages: "[bn/en]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
  const userID = event.senderID;
  const userData = await EcoData.get(userID, Users);
  const input = args[0] ? args[0].toLowerCase() : "bn";
  const category = (input === "en" || input === "english") ? "english" : "bangla";

  try {
    const response = await axios.get(`${await getBaseApiUrl()}/quiz?category=${category}&q=random`);
    const quizData = response.data.question;
    const { question, correctAnswer, options } = quizData;
    const { a, b, c, d } = options;
    const name = await Users.getNameUser(userID);

    const msg = {
      body:
        `\n╭──✦ ${question}\n` +
        `├‣ 𝗔) ${a}\n` +
        `├‣ 𝗕) ${b}\n` +
        `├‣ 𝗖) ${c}\n` +
        `├‣ 𝗗) ${d}\n` +
        `╰──────────────────‣\nReply to this message with your answer.`
    };

    api.sendMessage(msg, event.threadID, (err, info) => {
      if (err) return console.error(err);
      if (!global.quizReplies) global.quizReplies = new Map();

      global.quizReplies.set(info.messageID, {
        userID,
        correctAnswer,
        attempts: 0,
        maxAttempts: 2,
        rewardCoins: 300,
        rewardExp: 100
      });

      setTimeout(() => api.unsendMessage(info.messageID), 300 * 1000);
    }, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function({ api, event, Users }) {
  if (!global.quizReplies) return;
  const replyData = global.quizReplies.get(event.messageID);
  if (!replyData) return;

  if (event.senderID !== replyData.userID) return api.sendMessage("❌ This is not your quiz!", event.threadID, event.messageID);

  if (replyData.attempts >= replyData.maxAttempts) {
    global.quizReplies.delete(event.messageID);
    return api.sendMessage(`🚫 Max attempts reached! Correct Answer: ${replyData.correctAnswer}`, event.threadID, event.messageID);
  }

  const answer = event.body.trim().toLowerCase();
  if (answer === replyData.correctAnswer.toLowerCase()) {
    global.quizReplies.delete(event.messageID);
    const userData = await EcoData.get(event.senderID, Users);
    userData.money += replyData.rewardCoins;
    userData.exp += replyData.rewardExp;
    await EcoData.set(event.senderID, Users, userData);

    return api.sendMessage(`🎉 Correct! +${replyData.rewardCoins} Coins, +${replyData.rewardExp} EXP`, event.threadID, event.messageID);
  } else {
    replyData.attempts += 1;
    global.quizReplies.set(event.messageID, replyData);
    return api.sendMessage(`❌ Wrong answer! Attempts left: ${replyData.maxAttempts - replyData.attempts}`, event.threadID, event.messageID);
  }
};
