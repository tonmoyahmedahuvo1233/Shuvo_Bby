const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "eat",
  version: "1.1",
  hasPermssion: 0,
  credits: "𝗦𝗵𝗮𝗵𝗮𝗱𝗮𝘁 𝗦𝗔𝗛𝗨 (Modified by Rahat)",
  description: "eat লিখে @mention করলে নিজের mp3 ভয়েস পাঠাবে 😁",
  commandCategory: "fun",
  usages: "-eat @mention",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, mentions } = event;
  const mentionIDs = Object.keys(mentions);

  if (mentionIDs.length === 0) {
    return api.sendMessage("😒 কাউকে mention করে খাও ভাই, একা একা খাওয়া যায় নাকি!", threadID, messageID);
  }

  const targetID = mentionIDs[0];
  const targetTag = mentions[targetID].replace("@", "");

  // তোমার নিজের ফাইল লোকেশন
  const voicesDir = path.join(__dirname, "voices");
  const voiceFiles = [
    path.join(voicesDir, "Khan.mp4.mp3"),
    path.join(voicesDir, "Khan2.mp4.mp3")
  ];

  try {
    // প্রথমে দুইটা ভয়েস একে একে পাঠাবে
    for (let i = 0; i < voiceFiles.length; i++) {
      const voicePath = voiceFiles[i];
      if (fs.existsSync(voicePath)) {
        await new Promise((resolve) => {
          api.sendMessage(
            { attachment: fs.createReadStream(voicePath) },
            threadID,
            () => resolve(),
            messageID
          );
        });
      } else {
        console.error("Voice file missing:", voicePath);
      }
    }

    // শেষে mention করে funny reply দিবে
    api.sendMessage({
      body: `😋 ${mentions[targetID]} আরো খাবি 🤣😁`,
      mentions: [
        {
          tag: mentions[targetID],
          id: targetID
        }
      ]
    }, threadID, messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage("😢 কিছু একটা সমস্যা হয়েছে ভাই, আবার চেষ্টা করো!", threadID, messageID);
  }
};
