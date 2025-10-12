const fs = require("fs-extra");
const axios = require("axios");
const Canvas = require("canvas");

module.exports.config = {
  name: "infocard",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝗥 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Create user info card",
  commandCategory: "editing",
  usages: "reply to a user or send your own",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { senderID, threadID, messageID } = event;
  let uid;

  // Check if reply to a message
  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  } else {
    uid = senderID;
  }

  // Paths
  const pathImg = __dirname + `/cache/${senderID}_${threadID}.png`;
  const pathAvata = __dirname + `/cache/avatar_${uid}.png`;

  try {
    // Fetch avatar
    const avatarBuffer = (await axios.get(`https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathAvata, Buffer.from(avatarBuffer));

    // Load avatar into canvas
    const canvas = Canvas.createCanvas(720, 720);
    const ctx = canvas.getContext("2d");
    const avatar = await Canvas.loadImage(pathAvata);

    // Draw avatar circular
    ctx.save();
    ctx.beginPath();
    ctx.arc(360, 360, 350, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 0, 0, 720, 720);
    ctx.restore();

    // Optional: Add text
    const name = (await Users.getNameUser(uid)) || "Unknown";
    ctx.font = "50px Arial";
    ctx.fillStyle = "#00FF00";
    ctx.textAlign = "center";
    ctx.fillText(name, 360, 700);

    // Save final image
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // Send image
    api.sendMessage({ body: "Here is your info card!", attachment: fs.createReadStream(pathImg) }, threadID, () => {
      fs.unlinkSync(pathImg);
      fs.unlinkSync(pathAvata);
    }, messageID);

  } catch (err) {
    console.log(err);
    return api.sendMessage("⚠️ Error creating info card.", threadID, messageID);
  }
};
