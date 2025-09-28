const axios = require("axios");

async function getBaseApiUrl() {
  const res = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
  return res.data.api;
}

module.exports.config = {
  name: "economy",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Dipto | GPT",
  description: "Economy: quiz, daily, balance, top",
  commandCategory: "economy",
  usages: "[quiz/daily/balance/top]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
  const command = args[0] ? args[0].toLowerCase() : "";
  const subArgs = args.slice(1);
  const userID = event.senderID;

  if (!global.EcoData) global.EcoData = {};
  if (!global.EcoData[userID]) {
    const data = await Users.getData(userID) || {};
    global.EcoData[userID] = {
      money: data.money || 0,
      exp: data.exp || 0,
      lastDaily: data.lastDaily || 0
    };
  }

  let userData = global.EcoData[userID];

  switch(command) {
    case "quiz":
      return runQuiz(api, event, subArgs, Users, userData, userID);
    case "daily":
      return runDaily(api, event, Users, userData, userID);
    case "balance":
      return runBalance(api, event, userData);
    case "top":
      return runTop(api, event, Users, global.EcoData);
    default:
      return api.sendMessage(
        "Usage:\n/quiz [bn/en]\n/daily\n/balance\n/top",
        event.threadID, event.messageID
      );
  }
};

// ====================== QUIZ ==========================
async function runQuiz(api, event, args, Users, userData, userID) {
  const input = args.join("").toLowerCase() || "bn";
  let category = "bangla";
  if (input === "en" || input === "english") category = "english";

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
}

// ====================== DAILY ==========================
async function runDaily(api, event, Users, userData, userID) {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (now - userData.lastDaily < oneDay) {
    const remaining = oneDay - (now - userData.lastDaily);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return api.sendMessage(
      `⏳ Already claimed!\nNext claim in: ${hours}h ${minutes}m ${seconds}s`,
      event.threadID, event.messageID
    );
  }

  const rewardCoins = 500;
  const rewardExp = 200;

  userData.money += rewardCoins;
  userData.exp += rewardExp;
  userData.lastDaily = now;

  await Users.setData(userID, userData);

  return api.sendMessage(
    `🎉 Daily Reward Claimed! 🎉\n🪙 Coins: ${rewardCoins}\n🌟 EXP: ${rewardExp}`,
    event.threadID, event.messageID
  );
}

// ====================== BALANCE =======================
function runBalance(api, event, userData) {
  return api.sendMessage(
    `💰 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 💰\n\n👤 User: You\n🪙 Coins: ${userData.money}\n🌟 EXP: ${userData.exp}`,
    event.threadID, event.messageID
  );
}

// ====================== TOP ===========================
async function runTop(api, event, Users, EcoData) {
  const allUsers = [];
  for (let uid in EcoData) {
    allUsers.push({ userID: uid, money: EcoData[uid].money || 0 });
  }
  const sorted = allUsers.sort((a,b)=>b.money-a.money).slice(0,10);

  let msg = `🏆 𝗧𝗢𝗣 10 𝗨𝗦𝗘𝗥𝗦 𝗕𝗬 𝗖𝗢𝗜𝗡𝗦 🏆\n\n`;
  for (let i=0;i<sorted.length;i++){
    const name = await Users.getNameUser(sorted[i].userID);
    msg += `${i+1}. ${name} — ${sorted[i].money} 💵\n`;
  }

  return api.sendMessage(msg, event.threadID, event.messageID);
}

// ====================== REPLY HANDLER =================
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
    const userData = await Users.getData(event.senderID);
    userData.money = (userData.money || 0) + replyData.rewardCoins;
    userData.exp = (userData.exp || 0) + replyData.rewardExp;
    await Users.setData(event.senderID, userData);
    if (!global.EcoData[event.senderID]) global.EcoData[event.senderID] = {};
    global.EcoData[event.senderID].money = userData.money;
    global.EcoData[event.senderID].exp = userData.exp;

    return api.sendMessage(`🎉 Correct! +${replyData.rewardCoins} Coins, +${replyData.rewardExp} EXP`, event.threadID, event.messageID);
  } else {
    replyData.attempts += 1;
    global.quizReplies.set(event.messageID, replyData);
    return api.sendMessage(`❌ Wrong answer! Attempts left: ${replyData.maxAttempts - replyData.attempts}`, event.threadID, event.messageID);
  }
};
