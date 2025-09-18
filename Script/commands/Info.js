module.exports.config = {
  name: "info",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
  description: "Bot information command",
  commandCategory: "For users",
  hide: true,
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
  const { threadID } = event;
  const axios = require("axios");

  const { configPath } = global.client;
  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  const { commands } = global.client;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : config.PREFIX;

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

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
┗━━━━━━━━━━━━━━━┛`;

  const mediaLinks = [
    "https://github.com/Boss-Rahat/Rahat_Bot/raw/refs/heads/main/rahat/500.jpg",
    "https://github.com/Boss-Rahat/Rahat_Bot/raw/refs/heads/main/rahat/600.png",
    "https://github.com/Boss-Rahat/Rahat_Bot/raw/refs/heads/main/rahat/600.png"
    // ভিডিও চাইলে .mp4 বা .gif link দিতে হবে
  ];

  // র‍্যান্ডম একটি URL নির্বাচন
  const mediaLink = mediaLinks[Math.floor(Math.random() * mediaLinks.length)];

  // stream করে সরাসরি পাঠানো
  const response = await axios({
    url: mediaLink,
    method: "GET",
    responseType: "stream"
  });

  api.sendMessage({ body: msg, attachment: response.data }, threadID);
};
