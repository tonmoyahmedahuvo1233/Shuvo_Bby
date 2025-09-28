const axios = require("axios");

async function getBaseApiUrl() {
  const res = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
  return res.data.api;
}

module.exports.config = {
  name: "quiz",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Dipto | GPT",
  description: "Play a quiz game in Bangla or English",
  commandCategory: "game",
  usages: "[bn/en]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Users }) {
  const input = args.join("").toLowerCase() || "bn";
  let category = "bangla";
  if (input === "en" || input === "english") category = "english";

  try {
    const response = await axios.get(`${await getBaseApiUrl()}/quiz?category=${category}&q=random`);
    const quizData = response.data.question;
    const { question, correctAnswer, options } = quizData;
    const { a, b, c, d } = options;
    const name = await Users.getNameUser(event.senderID);

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
      if (!global.client.handleReply) global.client.handleReply = [];
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        correctAnswer,
        attempts: 0,
        maxAttempts: 2,
        data: quizData,
        playerName: name
      });

      setTimeout(() => api.unsendMessage(info.messageID), 300 * 1000);
    }, event.messageID);

  } catch (error) {
    console.error("❌ | Error:", error);
    return api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply, Users }) {
  const { author, correctAnswer, playerName, attempts, maxAttempts } = handleReply;
  if (event.senderID !== author) return api.sendMessage("❌ | This question is not for you!", event.threadID, event.messageID);

  let userAnswer = event.body.trim().toLowerCase();
  if (attempts >= maxAttempts) {
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(
      `🚫 | ${playerName}, you reached the max attempts.\n✅ Correct Answer: ${correctAnswer}`,
      event.threadID,
      event.messageID
    );
  }

  if (userAnswer === correctAnswer.toLowerCase()) {
    api.unsendMessage(handleReply.messageID);
    const rewardCoins = 300;
    const rewardExp = 100;
    let userData = await Users.getData(author);
    await Users.setData(author, {
      ...userData,
      money: (userData.money || 0) + rewardCoins,
      exp: (userData.exp || 0) + rewardExp
    });

    return api.sendMessage(
      `🎉 Congratulations, ${playerName}!\n✅ Correct Answer!\n+${rewardCoins} Coins 💰\n+${rewardExp} EXP 🌟`,
      event.threadID,
      event.messageID
    );
  } else {
    handleReply.attempts += 1;
    return api.sendMessage(
      `❌ | Wrong Answer.\nYou have ${maxAttempts - handleReply.attempts} attempt(s) left.`,
      event.threadID,
      event.messageID
    );
  }
};
