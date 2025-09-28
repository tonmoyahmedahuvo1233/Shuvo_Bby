// 📄 top.js
const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

function loadData() {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(path));
}

// ব্যালেন্স ফরম্যাটিং (balance.js-এর মতো)
function formatBalance(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(1).replace(/\.0$/, '') + "T$";
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + "B$";
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + "M$";
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + "k$";
  return num + "$";
}

module.exports.config = {
  name: "top",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Akash × ChatGPT",
  description: "📊 Show Top Richest Users Leaderboard",
  commandCategory: "Economy",
  usages: "/top",
  cooldowns: 5
};

module.exports.run = async function({ api, event, Users }) {
  const { threadID, messageID } = event;

  const data = loadData();
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return api.sendMessage("📢 No users found in the leaderboard yet!", threadID, messageID);
  }

  // Sort by balance descending
  const sorted = entries.sort((a, b) => b[1].balance - a[1].balance);

  // Top 10
  const top10 = sorted.slice(0, 10);

  let msg = "🏆 𝗧𝗼𝗽 𝟭𝟬 𝗥𝗶𝗰𝗵𝗲𝘀𝘁 𝗨𝘀𝗲𝗿𝘀 🏆\n━━━━━━━━━━━━━━━━━━\n";

  for (let i = 0; i < top10.length; i++) {
    const [userID, info] = top10[i];
    let name;
    try {
      name = await Users.getNameUser(userID);
    } catch {
      name = `Unknown (${userID})`;
    }
    msg += `${i + 1}. ${name} → ${formatBalance(info.balance)}\n`;
  }

  msg += "━━━━━━━━━━━━━━━━━━\n💰 Keep playing to rank up!";

  return api.sendMessage(msg, threadID, messageID);
};
