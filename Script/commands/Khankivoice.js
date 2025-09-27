const fs = require("fs");
const path = require("path");

// Recursive file finder function
function findFileRecursive(dir, filename) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const found = findFileRecursive(fullPath, filename);
      if (found) return found;
    } else if (file.toLowerCase() === filename.toLowerCase()) {
      return fullPath;
    }
  }
  return null;
}

module.exports.config = {
  name: "Khanki",
  version: "3.0",
  author: "🔰𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁🔰",
  countDown: 5,
  role: 2,
  shortDescription: "অডিও পাঠাবে",
  longDescription: "!Khanki @user",
  category: "fun",
  guide: {
    en: "{pn} @mention"
  }
};

module.exports.onStart = async function ({ api, event, args, Users }) {
  if (!event.mentions || Object.keys(event.mentions).length === 0) {
    return api.sendMessage("কারো মেনশন করো 𝗥𝗮𝗵𝗮𝘁 Boss 🙂", event.threadID, event.messageID);
  }

  try {
    const mentionID = Object.keys(event.mentions)[0];
    const mentionName = event.mentions[mentionID] || (await Users.getName(mentionID));

    const projectRoot = process.cwd();
    // প্রথম ভয়েস ফাইল
    const voiceFile1 = findFileRecursive(projectRoot, "Khan.mp4.mp3");
    // দ্বিতীয় ভয়েস ফাইল
    const voiceFile2 = findFileRecursive(projectRoot, "Khan2.mp4.mp3");

    if (!voiceFile1 || !voiceFile2) {
      return api.sendMessage(
        `${mentionName} ⚠️ খুঁজেও সব ভয়েস ফাইল পাওয়া যায়নি`,
        event.threadID,
        event.messageID
      );
    }

    // ১ম ভয়েস পাঠানো
    await api.sendMessage(
      {
        attachment: fs.createReadStream(voiceFile1)
      },
      event.threadID
    );

    // ২য় ভয়েস পাঠানো
    await api.sendMessage(
      {
        attachment: fs.createReadStream(voiceFile2)
      },
      event.threadID
    );

    // মেনশন মেসেজ পাঠানো
    return api.sendMessage(
      {
        body: `${mentionName} খানকির পোলা🫦💦\nতোর জন্য এই ২টা ভয়েস 😏\n 𝗥𝗮𝗵𝗮𝘁 বসের বদলে আমি চুদে দিলাম💋💦`,
        mentions: [{ tag: mentionName, id: mentionID }]
      },
      event.threadID
    );

  } catch (err) {
    console.error("Error in Khanki command:", err);
    return api.sendMessage(
      "ত্রুটি হলেও ভয় নেই 🙂 বট ক্র্যাশ করবে না, কিন্তু ভয়েস ফাইলগুলো পাওয়া যায়নি।",
      event.threadID,
      event.messageID
    );
  }
};
