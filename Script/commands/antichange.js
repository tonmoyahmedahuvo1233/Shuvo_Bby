const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "antichange",
    version: "1.0",
    author: "Akash × ChatGPT",
    role: 1,
    shortDescription: "Protect group name and profile photo",
    longDescription: "Prevents non-admin users from changing group name or group profile photo.",
    category: "group",
  },

  onLoad: async function ({ api, event }) {
    const folder = path.join(__dirname, "antichange_data");
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);
  },

  onEvent: async function ({ api, event, Threads }) {
    const threadID = event.threadID;
    const folder = path.join(__dirname, "antichange_data");
    const dataFile = path.join(folder, `${threadID}.json`);

    // Load or create data file
    let data = {};
    if (fs.existsSync(dataFile)) {
      data = JSON.parse(fs.readFileSync(dataFile));
    }

    // Event: Group info changed
    if (event.logMessageType === "log:thread-name") {
      const author = event.author;
      const threadInfo = await api.getThreadInfo(threadID);
      const admins = threadInfo.adminIDs.map(a => a.id);

      if (!admins.includes(author)) {
        // Non-admin changed group name — revert
        const oldName = data.name || threadInfo.threadName;
        await api.setTitle(oldName, threadID);
        api.sendMessage("⚠️ শুধুমাত্র অ্যাডমিনরা গ্রুপের নাম পরিবর্তন করতে পারে!", threadID);
      } else {
        // Admin changed — save new name
        data.name = threadInfo.threadName;
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
      }
    }

    // Event: Group profile picture changed
    if (event.logMessageType === "log:thread-image") {
      const author = event.author;
      const threadInfo = await api.getThreadInfo(threadID);
      const admins = threadInfo.adminIDs.map(a => a.id);

      if (!admins.includes(author)) {
        // Revert old photo if available
        if (data.photo) {
          const img = (await axios.get(data.photo, { responseType: "stream" })).data;
          await api.changeGroupImage(img, threadID);
          api.sendMessage("⚠️ শুধুমাত্র অ্যাডমিনরা গ্রুপের ছবি পরিবর্তন করতে পারে!", threadID);
        }
      } else {
        // Admin changed — save new photo
        const photoUrl = threadInfo.imageSrc;
        if (photoUrl) {
          data.photo = photoUrl;
          fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        }
      }
    }
  },
};
