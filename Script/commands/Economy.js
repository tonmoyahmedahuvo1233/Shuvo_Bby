// Economy.js
const axios = require("axios");
const fs = require("fs");
const fse = require("fs-extra");
const request = require("request");
const path = require("path");

const DATA_FILE = __dirname + "/coinxbalance.json";
const CACHE_DIR = __dirname + "/cache";
const ADMIN_ID = "61561511477968"; // bot admin id
const ADMIN_BALANCE = 5000000; // ৫০ লাখ

// ensure cache folder
if (!fs.existsSync(CACHE_DIR)) fse.mkdirpSync(CACHE_DIR);

// ensure data file
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getBalance(userID) {
  if (userID === ADMIN_ID) return ADMIN_BALANCE;
  const data = readData();
  return data[userID]?.balance ?? 100;
}

function setBalance(userID, amount) {
  const data = readData();
  if (userID === ADMIN_ID) {
    data[ADMIN_ID] = data[ADMIN_ID] || {};
    data[ADMIN_ID].balance = ADMIN_BALANCE;
    writeData(data);
    return;
  }
  data[userID] = data[userID] || {};
  data[userID].balance = amount;
  writeData(data);
}

function formatBalance(num) {
  if (num >= 1e7) return "৳" + (num / 1e7).toFixed(2).replace(/\.00$/, '') + "Cr";
  if (num >= 1e5) return "৳" + (num / 1e5).toFixed(2).replace(/\.00$/, '') + "L";
  return "৳" + num.toLocaleString("en-US");
}

// config
module.exports.config = {
  name: "economy",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Akash × ChatGPT",
  description: "Economy system: balance, top, daily, quiz, TikTokvideo, send — single file",
  commandCategory: "Economy",
  usages: "/balance | /top | /daily | /quiz | /TikTokvideo | /send",
  cooldowns: 5,
  dependencies: { axios: "", request: "", "fs-extra": "" }
};

// TikTok video links (short sample, প্রয়োজন অনুযায়ী বাড়াও)
const videoLinks = [
  "https://drive.google.com/uc?export=download&id=1-gJdG8bxmZLyOC7-6E4A5Hm95Q9gWIPO",
  "https://drive.google.com/uc?export=download&id=1-ryNR8j529EZyTCuMur9wmkFz4ahlv-f"
];

// helper: get user name
async function getName(api, uid) {
  try {
    const info = await api.getUserInfo(uid);
    return info[uid]?.name || uid;
  } catch {
    return uid;
  }
}

// handleReply storage
if (!global.client.handleReply) global.client.handleReply = [];

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, senderID, messageID, body, mentions } = event;
  const input = (body || "").trim();
  const parts = input.split(/\s+/);
  const cmdRaw = parts[0] || "";
  const cmd = cmdRaw.replace(/^\//, "").toLowerCase();
  const params = parts.slice(1);

  switch (cmd) {
    case "balance":
    case "bal": {
      let uid = params[0] ? (params[0].startsWith("@") && mentions ? Object.keys(mentions)[0] : params[0]) : senderID;
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
        balance: data[uid]?.balance ?? (uid === ADMIN_ID ? ADMIN_BALANCE : 0)
      }));
      arr.sort((a,b)=>b.balance-a.balance);
      const topList = arr.slice(0,10).map((u,i)=>`${i+1}. ${u.uid===ADMIN_ID?"ADMIN":u.uid} — ${formatBalance(u.balance)}`).join("\n");
      return api.sendMessage(`🏆 টপ প্লেয়ারস\n\n${topList}`, threadID, messageID);
    }

    case "daily": {
      let data = readData();
      const user = data[senderID] || {};
      const now = Date.now();
      const last = user.lastDaily || 0;
      const ONE_DAY = 24*60*60*1000;

      if(senderID===ADMIN_ID) return api.sendMessage(`✅ Admin হিসেবে ব্যালেন্স: ${formatBalance(getBalance(ADMIN_ID))}`, threadID, messageID);
      if(now-last<ONE_DAY){
        const remain = ONE_DAY-(now-last);
        const hrs = Math.floor(remain/(60*60*1000));
        const mins = Math.floor((remain%(60*60*1000))/(60*1000));
        return api.sendMessage(`⏳ পরবর্তী ডেইলি ${hrs} ঘন্টা ${mins} মিনিট পরে।`, threadID, messageID);
      }
      const give = 30;
      const bal = getBalance(senderID)+give;
      data[senderID] = data[senderID] || {};
      data[senderID].balance = bal;
      data[senderID].lastDaily = now;
      writeData(data);
      return api.sendMessage(`✅ দৈনিক বোনাস: ${formatBalance(give)}\nনতুন ব্যালেন্স: ${formatBalance(bal)}`, threadID, messageID);
    }

    case "quiz": {
      if(params[0]?.toLowerCase()==="h") return api.sendMessage(`🧠 কুইজ নির্দেশিকা:\n➤ /quiz\n➤ সঠিক: +30 টাকা\n➤ ভুল: -2 টাকা\n➤ সময়: 20 সেকেন্ড`, threadID, messageID);
      let balNow = getBalance(senderID);
      if(balNow<30 && senderID!==ADMIN_ID) return api.sendMessage("❌ খেলতে কমপক্ষে 30 টাকা লাগবে।", threadID, messageID);

      try {
        const res = await axios.get(`https://rubish-apihub.onrender.com/rubish/quiz-api?category=Bangla&apikey=rubish69`);
        const q = res.data;
        if(!q?.question||!q?.answer) throw new Error("Invalid quiz");

        const formatted = 
`╭──✦ ${q.question}
├‣ 𝗔) ${q.A}
├‣ 𝗕) ${q.B}
├‣ 𝗖) ${q.C}
├‣ 𝗗) ${q.D}
╰──────────────────‣ উত্তর পাঠাও (A/B/C/D). সময়: 20s`;

        return api.sendMessage(formatted, threadID, async(err, info)=>{
          if(err) return console.error(err);
          const timeout = setTimeout(async()=>{
            const idx = global.client.handleReply.findIndex(e=>e.messageID===info.messageID);
            if(idx!==-1){
              try{await api.unsendMessage(info.messageID);}catch{}
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
      const cost = 60;
      if(senderID!==ADMIN_ID){
        const bal = getBalance(senderID);
        if(bal<cost) return api.sendMessage(`❌ ব্যালেন্স পর্যাপ্ত নয়। ৬০ টাকা লাগবে।`, threadID, messageID);
        setBalance(senderID, bal-cost);
      }
      const randomLink = videoLinks[Math.floor(Math.random()*videoLinks.length)];
      const videoPath = path.join(CACHE_DIR, `video_${Date.now()}.mp4`);
      api.sendMessage("ভিডিও লোড হচ্ছে, অপেক্ষা করো...", threadID);
      request(encodeURI(randomLink)).pipe(fs.createWriteStream(videoPath))
        .on("close",()=>{
          api.sendMessage({body:`🎬 ভিডিও দেখো।`,attachment:fs.createReadStream(videoPath)}, threadID, ()=>fs.unlinkSync(videoPath));
        }).on("error",(err)=>{
          console.error("ভিডিও ডাউনলোড ত্রুটি:",err);
          api.sendMessage("❌ ভিডিও ডাউনলোড করতে ব্যর্থ।", threadID);
        });
      break;
    }

    case "send": {
      if(params.length<2) return api.sendMessage("ব্যবহার: /send <টাকা> <@user বা uid>", threadID);
      let amount = parseInt(params[0]);
      if(isNaN(amount)||amount<=0) return api.sendMessage("❌ সঠিক পরিমাণ উল্লেখ করো।", threadID);
      let toUID = params[1].startsWith("@")&&mentions?Object.keys(mentions)[0]:params[1];
      if(!toUID) return api.sendMessage("❌ সঠিক ইউজার উল্লেখ করো।", threadID);
      const senderBal = getBalance(senderID);
      if(amount>senderBal) return api.sendMessage("❌ পর্যাপ্ত ব্যালেন্স নেই।", threadID);
      setBalance(senderID,senderBal-amount);
      const recBal = getBalance(toUID);
      setBalance(toUID,recBal+amount);
      return api.sendMessage(`✅ ${formatBalance(amount)} পাঠানো হয়েছে\n📌 তোমার নতুন ব্যালেন্স: ${formatBalance(getBalance(senderID))}`, threadID);
    }

    default:
      return api.sendMessage("❌ কমান্ড পাওয়া যায়নি।", threadID, messageID);
  }
};

module.exports.handleReply = async function({ api, event, handleReply }){
  const { senderID, messageID, threadID, body } = event;
  if(senderID!==handleReply.author) return;
  const userAnswer = body.trim().toUpperCase();
  if(!["A","B","C","D"].includes(userAnswer)) return api.sendMessage("⚠️ A/B/C/D উত্তর দিন", threadID, messageID);
  clearTimeout(handleReply.timeout);
  let balance = getBalance(senderID);
  if(userAnswer===handleReply.answer){
    balance += handleReply.reward;
    setBalance(senderID,balance);
    await api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`✅ Correct!\n💰 You earned 1000 Coins\n📌 New Balance: ${formatBalance(balance)}`,
      threadID,
      messageID
    );
  } else {
    balance -= 50; // Quiz হারের Coins
    if (balance < 0) balance = 0;
    setBalance(senderID, balance);

    return api.sendMessage(
      `❌ Wrong answer!\n✅ Correct answer: ${handleReply.answer}\n💸 50 Coins deducted\n📌 New Balance: ${formatBalance(balance)}`,
      threadID,
      messageID
    );
  }
