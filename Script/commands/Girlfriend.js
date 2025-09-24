// girlfriend.js — Couple Frame (GF version, fine-tuned positions)
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
 name: "girlfriend",
 version: "7.3.1",
 hasPermssion: 0,
 credits: "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 description: "Get girlfriend From Mention",
 commandCategory: "img",
 usages: "[@mention]",
 cooldowns: 5,
 dependencies: {
 "axios": "",
 "fs-extra": "",
 "path": "",
 "jimp": ""
 }
};

module.exports.run = async function ({ api, event }) {
  try {
    const mention = Object.keys(event.mentions || {})[0];
    if (!mention)
      return api.sendMessage("❌কাকে স্কুল জীবনের না পাওয়া সেই মজা দিতে চাও তাকে mention করো 🔞👅", event.threadID, event.messageID);

    const mentionName = event.mentions[mention];
    const senderID = event.senderID;

    // Google Drive frame link
    const FILE_ID = "1j9ibq0yLsr2qw0mi3ANSPGV1TMe-zrZY";
    const frameUrl = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;

    // Profile URLs
    const mentionUrl = `https://graph.facebook.com/${mention}/picture?width=1024&height=1024&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const senderUrl  = `https://graph.facebook.com/${senderID}/picture?width=1024&height=1024&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

    // Load images
    const [frameImg, mentionImg, senderImg] = await Promise.all([
      loadImage(frameUrl),
      loadImage(mentionUrl),
      loadImage(senderUrl)
    ]);

    const W = frameImg.width, H = frameImg.height;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Draw frame
    ctx.drawImage(frameImg, 0, 0, W, H);

    // --- Profile sizes & positions ---
    const sizeSender = 211; 
    const rSender = sizeSender / 2;

    const sizeMention = 218; 
    const rMention = sizeMention / 2;

    const left  = { x: 574, y: 75 };        // Sender (ছেলে)
    const right = { x: 1040, y: 180 };      // Mention (মেয়ে)

    // Left (sender / ছেলে)
    ctx.save();
    ctx.beginPath();
    ctx.arc(left.x + rSender, left.y + rSender, rSender, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(senderImg, left.x, left.y, sizeSender, sizeSender);
    ctx.restore();

    // Right (mention / মেয়ে)
    ctx.save();
    ctx.beginPath();
    ctx.arc(right.x + rMention, right.y + rMention, rMention, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(mentionImg, right.x, right.y, sizeMention, sizeMention);
    ctx.restore();

    // Save & send
    const outPath = path.join(__dirname, "girlfriend_result.png");
    fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

    return api.sendMessage({
      body: `🔰𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁🔰 \n ${mentionName}➕You = স্কুল জীবনে না পাওয়া এক দৃশ্য🐸🙂`,
      mentions: [{ tag: mentionName, id: mention }],
      attachment: fs.createReadStream(outPath)
    }, event.threadID, event.messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage("⚠️ Error generating girlfriend frame.", event.threadID, event.messageID);
  }
};
