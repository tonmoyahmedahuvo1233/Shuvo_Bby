const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "antichange data",
    aliases: ["acdata", "antichangedata"],
    version: "1.0",
    author: "Akash × ChatGPT",
    role: 1,
    shortDescription: "Manage anti-change stored data",
    longDescription: "View or clear saved anti-change group info (old name and photo).",
    category: "system",
    guide: {
      en: "{p}antichange data\n{p}antichange data clear"
    }
  },

  onStart: async function ({ api, event, args }) {
    const folder = path.join(__dirname, "antichange_data");
    if (!fs.existsSync(folder)) return api.sendMessage("⚠️ 'antichange_data' ফোল্ডার পাওয়া যায়নি।", event.threadID);

    // Clear all saved data
    if (args[0] === "clear") {
      const files = fs.readdirSync(folder);
      for (const file of files) fs.unlinkSync(path.join(folder, file));
      return api.sendMessage("🧹 সব গ্রুপের anti-change ডেটা মুছে ফেলা হয়েছে।", event.threadID);
    }

    // Show data for current thread
    const threadID = event.threadID;
    const dataFile = path.join(folder, `${threadID}.json`);

    if (!fs.existsSync(dataFile)) {
      return api.sendMessage("❌ এই গ্রুপের কোনো anti-change ডেটা নেই।", event.threadID);
    }

    const data = JSON.parse(fs.readFileSync(dataFile));

    let msg = "🛡️ Anti-Change Data\n";
    msg += `📘 Group ID: ${threadID}\n`;
    msg += `📛 Saved Name: ${data.name || "❌ কিছু নেই"}\n`;
    msg += `🖼️ Saved Photo: ${data.photo ? "আছে ✅" : "❌ নেই"}`;

    if (data.photo) {
      try {
        const img = (await axios.get(data.photo, { responseType: "stream" })).data;
        return api.sendMessage({ body: msg, attachment: img }, event.threadID);
      } catch (err) {
        return api.sendMessage(msg + "\n(⚠️ ছবি লোড করা যায়নি)", event.threadID);
      }
    } else {
      return api.sendMessage(msg, event.threadID);
    }
  }
};
