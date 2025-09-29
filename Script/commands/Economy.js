// Economy.js
const axios = require("axios");
const fs = require("fs");
const fse = require("fs-extra");
const request = require("request");
const path = require("path");

const DATA_FILE = __dirname + "/coinxbalance.json";
const CACHE_DIR = __dirname + "/cache";
const ADMIN_ID = "61561511477968"; // bot admin id
const ADMIN_BALANCE = 5000000; // 50 লাখ

// ensure cache folder
if (!fs.existsSync(CACHE_DIR)) {
  fse.mkdirpSync(CACHE_DIR);
}

// ensure data file
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

// read/write helper
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (e) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// balance helpers
function getBalance(userID) {
  const data = readData();
  if (userID === ADMIN_ID) return ADMIN_BALANCE;
  if (data[userID] && typeof data[userID].balance === "number") return data[userID].balance;
  return 100; // default for new users
}

function setBalance(userID, amount) {
  const data = readData();
  if (userID === ADMIN_ID) {
    data[userID] = data[userID] || {};
    data[userID].balance = ADMIN_BALANCE;
    writeData(data);
    return;
  }
  data[userID] = data[userID] || {};
  data[userID].balance = amount;
  writeData(data);
}

function formatBalance(num) {
  if (typeof num !== "number") num = Number(num) || 0;
  if (num >= 1e7) return "৳" + (num / 1e7).toFixed(2).replace(/\.00$/, '') + "Cr";
  if (num >= 1e5) return "৳" + (num / 1e5).toFixed(2).replace(/\.00$/, '') + "L";
  return "৳" + num.toLocaleString("en-US");
}

// module config
module.exports.config = {
  name: "economy",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Akash × ChatGPT",
  description: "Economy system: balance, top, daily, quiz, TikTokvideo, send — single file",
  commandCategory: "Economy",
  usages: "/balance | /top | /daily | /quiz | /TikTokvideo | /send",
  cooldowns: 5,
  dependencies: { axios: "", request: "", "fs-extra": "" }
};

// ---------- TikTok video links ----------
const videoLinks = [
  "https://drive.google.com/uc?export=download&id=1-gJdG8bxmZLyOC7-6E4A5Hm95Q9gWIPO",
  "https://drive.google.com/uc?export=download&id=1-ryNR8j529EZyTCuMur9wmkFz4ahlv-f"
  // ...তোমার সব ভিডিও লিংক এখানে রাখো
];

// ------------- main run -------------
module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, senderID, messageID, body, mentions } = event;
  const input = (body || "").trim();
  const parts = input.split(/\s+/);
  const cmdRaw = parts[0] || "";
  const cmd = cmdRaw.replace(/^\//, "").toLowerCase();
  const params = parts.slice(1);

  try {
    switch (cmd) {
      case "balance":
      case "bal": {
        const uid = params[0] ? (params[0].startsWith("@") && mentions ? Object.keys(mentions)[0] : params[0]) : senderID;
        const bal = getBalance(uid);
        const name = uid === senderID ? "তুমি" : await getName(api, uid);
        return api.sendMessage(`${name} - ব্যালেন্স: ${formatBalance(bal)}`, threadID, messageID);
      }

      case "top": {
        const data = readData();
        data[ADMIN_ID] = data[ADMIN_ID] || {};
        data[ADMIN_ID].balance = ADMIN_BALANCE;

        const arr = Object.keys(data).map(uid => ({
          uid,
          balance: typeof data[uid].balance === "number" ? data[uid].balance : (uid === ADMIN_ID ? ADMIN_BALANCE : 0)
        }));
        arr.sort((a,b)=>b.balance - a.balance);
        const topList = arr.slice(0,10).map((u,i)=>`${i+1}. ${u.uid===ADMIN_ID?"ADMIN":u.uid} — ${formatBalance(u.balance)}`).join("\n");
        return api.sendMessage(`🏆 টপ প্লেয়ারস\n\n${topList}`, threadID, messageID);
      }

      case "daily": {
        let data = readData();
        const user = data[senderID] || {};
        const now = Date.now();
        const last = user.lastDaily || 0;
        const ONE_DAY = 24*60*60*1000;

        if (senderID === ADMIN_ID) {
          return api.sendMessage(`✅ Admin হিসেবে তোমার ব্যালেন্স: ${formatBalance(getBalance(ADMIN_ID))}`, threadID, messageID);
        }

        if (now - last < ONE_DAY) {
          const remain = ONE_DAY - (now - last);
          const hrs = Math.floor(remain / (60*60*1000));
          const mins = Math.floor((remain % (60*60*1000)) / (60*1000));
          return api.sendMessage(`⏳ পরবর্তী ডেইলি ${hrs} ঘন্টা ${mins} মিনিট পরে পাবো।`, threadID, messageID);
        }

        const give = 30;
        const bal = getBalance(senderID) + give;
        data[senderID] = data[senderID] || {};
        data[senderID].balance = bal;
        data[senderID].lastDaily = now;
        writeData(data);
        return api.sendMessage(`✅ দৈনিক বোনাস: ${formatBalance(give)}\nতোমার নতুন ব্যালেন্স: ${formatBalance(bal)}`, threadID, messageID);
      }

      case "quiz": {
        if (params[0]?.toLowerCase() === "h") {
          return api.sendMessage(`🧠 কুইজ নির্দেশিকা:\n➤ /quiz\n➤ সঠিক: +30 টাকা\n➤ ভুল: -2 টাকা\n➤ 20 সেকেন্ড সময়`, threadID, messageID);
        }
        let balNow = getBalance(senderID);
        if (balNow < 30 && senderID!==ADMIN_ID) return api.sendMessage("❌ খেলতে কমপক্ষে 30 টাকা লাগবে।", threadID, messageID);

        try {
          const res = await axios.get(`https://rubish-apihub.onrender.com/rubish/quiz-api?category=Bangla&apikey=rubish69`);
          const q = res.data;
          if (!q?.question || !q?.answer) throw new Error("Invalid quiz");

          const formatted =
`╭──✦ ${q.question}
├‣ 𝗔) ${q.A}
├‣ 𝗕) ${q.B}
├‣ 𝗖) ${q.C}
├‣ 𝗗) ${q.D}
╰──────────────────‣ উত্তর পাঠাও (A/B/C/D). সময়: 20s`;

          return api.sendMessage(formatted, threadID, async (err, info)=>{
            if(err) return console.error(err);

            const timeout = setTimeout(async()=>{
              const idx = global.client.handleReply.findIndex(e=>e.messageID===info.messageID);
              if(idx!==-1){
                try{await api.unsendMessage(info.messageID);}catch(e){}
                api.sendMessage(`⏰ সময় শেষ! সঠিক উত্তর: ${q.answer}`, threadID);
                global.client.handleReply.splice(idx,1);
              }
            },20*1000);

            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: senderID,
              answer: q.answer.toString().toUpperCase(),
              reward: 30,
              penalty: 2,
              timeout
            });
          });

        } catch(e){
          console.error("Quiz API error:",e);
          return api.sendMessage("❌ কুইজ লোড করতে ব্যর্থ।", threadID, messageID);
        }
      }

      case "tiktokvideo":
      case "tiktok": {
        if (!videoLinks.length) return api.sendMessage("ভিডিও লিংক পাওয়া যায়নি।", threadID, messageID);
        const cost = 60;
        if(senderID!==ADMIN_ID){
          const bal = getBalance(senderID);
          if(bal<cost) return api.sendMessage(`❌ তোমার ব্যালেন্স পর্যাপ্ত নয়। ৬০ টাকা লাগবে।`, threadID, messageID);
          setBalance(senderID, bal - cost);
        }

        const randomLink = videoLinks[Math.floor(Math.random()*videoLinks.length)];
        const videoPath = path.join(CACHE_DIR, `video_${Date.now()}.mp4`);

        api.sendMessage("ভিডিও লোড হচ্ছে, একটু অপেক্ষা করো...", threadID);
        request(encodeURI(randomLink)).pipe(fs.createWriteStream(videoPath))
          .on("close",()=>{
            api.sendMessage({
              body: `🎬 ভিডিও দেখো। ৬০ টাকা কেটে দেওয়া হয়েছে (সাধারণ ইউজারদের জন্য)।`,
              attachment: fs.createReadStream(videoPath)
            }, threadID, ()=>{
