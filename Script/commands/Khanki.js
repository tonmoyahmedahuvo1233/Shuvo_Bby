module.exports.config = {
  name: "khanki",
  version: "1.0",
  hasPermssion: 2,
  credits: "𝗦𝗵𝗮𝗵𝗮𝗱𝗮𝘁 𝗦𝗔𝗛𝗨 (Modified by Rahat)",
  description: "khanki লিখে @mention করলে cute voice সহ funny reply দিবে 😁",
  commandCategory: "fun",
  usages: "-eat @mention",
  cooldowns: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const voiceLinks = [
  "https://files.catbox.moe/ypv6z9.mp3",
  "https://files.catbox.moe/8u6l58.mp3"
];

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, mentions } = event;
  const mentionIDs = Object.keys(mentions);

  // যদি কেউ mention না করে
  if (mentionIDs.length === 0) {
    return api.sendMessage("Boss কোন এক বোকাচোদাকে mention করো😗🤢", threadID, messageID);
  }

  const targetID = mentionIDs[0];
  const targetName = mentions[targetID].replace("@", "");
  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  try {
    // ২-৩ টা voice clip একে একে পাঠানো
    for (let i = 0; i < voiceLinks.length; i++) {
      const url = voiceLinks[i];
      const filePath = path.join(cacheDir, `voice${i}.mp3`);
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream'
      });
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', () => {
          api.sendMessage({
            attachment: fs.createReadStream(filePath)
          }, threadID, () => {
            fs.unlink(filePath, () => {});
            resolve();
          });
        });
        writer.on('error', reject);
      });
    }

    // শেষে mention করে reply দেবে
    api.sendMessage({
      body: `${mentions[targetID]} খানকি-মাগি তোর জন্য এই দুইটা ভয়েস😗🤣\nরাহাদ বসের বদলে চুদে দিলাম🤢😗`,
      mentions: [{
        tag: mentions[targetID],
        id: targetID
      }]
    }, threadID, messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("😢 কিছু একটা সমস্যা হয়েছে রাহাদ বস, আবার চেষ্টা করো!", threadID, messageID);
  }
};
