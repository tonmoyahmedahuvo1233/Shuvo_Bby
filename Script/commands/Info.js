const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "info",
  version: "1.6.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
  description: "Bot information command",
  commandCategory: "For users",
  hide: true,
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  // info message
  const msg = `┏━━━━━━━━━━━━━━━┓
┃   🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟    
┣━━━━━━━━━━━━━━━┫
┃👤 𝐍𝐚𝐦𝐞      :🔰𝗥𝗮𝗵𝗮𝘁🔰
┃🚹 𝐆𝐞𝐧𝐝𝐞𝐫    : 𝐌𝐚𝐥e
┃🎂 𝐀𝐠𝐞       :16
┃🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧  : 𝐈𝐬𝐥𝐚𝐦
┃🏫 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 :বয়ড়া ইসরাইল 
┃𝐀𝐝𝐝𝐫𝐞𝐬𝐬:জামালপুর,বাংলাদেশ 
┣━━━━━━━━━━━━━━━┫
┃𝐓𝐢𝐤𝐭𝐨𝐤 : @where.is.she15
┃📢 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦 :আছে🥴🤪
┃🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : বায়ো-তে আছে
┣━━━━━━━━━━━━━━━┫
┃ 🕒 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 𝐓𝐢𝐦𝐞:  ${time}
┗━━━━━━━━━━━━━━━┛
`;

  // __dirname/rahat ফোল্ডার থেকে মিডিয়া 
  const mediaFolder = path.join(__dirname, "rahat");

  if (!fs.existsSync(mediaFolder)) {
    return api.sendMessage("❌ rahat ফোল্ডার পাওয়া যায়নি!", threadID);
  }

  // শুধুমাত্র মিডিয়া ফাইল (.jpg, .png, .gif, .mp4)
  const mediaFiles = fs.readdirSync(mediaFolder)
    .filter(file => /\.(jpg|jpeg|png|gif|mp4)$/i.test(file))
    .map(file => path.join(mediaFolder, file));

  if (mediaFiles.length === 0) {
    return api.sendMessage("❌ rahat ফোল্ডারে কোনো ছবি বা ভিডিও পাওয়া যায়নি!", threadID);
  }

  // র‍্যান্ডম একটি ফাইল নির্বাচন
  const randomFile = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];

  // পাঠানো
  api.sendMessage({
    body: msg,
    attachment: fs.createReadStream(randomFile)
  }, threadID);
};
