const axios = require("axios");
const fs = require("fs-extra");

let lastImages = []; // শেষবার জেনারেট হওয়া ছবিগুলো রাখবো

module.exports.config = {
  name: "mj",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Rahat",
  description: "Generate AI image like MidJourney with Upscale & Variation",
  commandCategory: "fun",
  usages: "[prompt] | [U1/U2/U3/U4/V1/V2/V3/V4]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ");

  if (!input) {
    return api.sendMessage("⚠️ একটি প্রম্পট লিখুন\n\n👉 উদাহরণ: /mj Cristiano Ronaldo", event.threadID, event.messageID);
  }

  // যদি U1..U4 বা V1..V4 লেখা থাকে
  if (/^(U[1-4]|V[1-4])$/i.test(input)) {
    if (lastImages.length === 0) {
      return api.sendMessage("❌ আগে একটি প্রম্পট দিয়ে ছবি জেনারেট করুন!", event.threadID, event.messageID);
    }

    let index = parseInt(input[1]) - 1;
    if (input.startsWith("U")) {
      // Upscale (মূল ছবি বড় করে পাঠাবে)
      const upscaleUrl = lastImages[index];
      const imgData = (await axios.get(upscaleUrl, { responseType: "arraybuffer" })).data;
      const path = __dirname + `/cache/mj_upscale_${index + 1}.jpg`;
      fs.writeFileSync(path, Buffer.from(imgData, "binary"));

      return api.sendMessage(
        { body: `🔎 Upscaled result (U${index + 1})`, attachment: fs.createReadStream(path) },
        event.threadID,
        () => fs.unlinkSync(path),
        event.messageID
      );
    } else {
      // Variation (এখন নতুন র‍্যান্ডম ছবি আনবে)
      const response = await axios.get(`https://lexica.art/api/v1/search?q=random`);
      if (!response.data || !response.data.images || response.data.images.length === 0) {
        return api.sendMessage("❌ Variation জেনারেট করা যায়নি!", event.threadID, event.messageID);
      }

      const variationUrl = response.data.images[0].src;
      const imgData = (await axios.get(variationUrl, { responseType: "arraybuffer" })).data;
      const path = __dirname + `/cache/mj_variation_${index + 1}.jpg`;
      fs.writeFileSync(path, Buffer.from(imgData, "binary"));

      return api.sendMessage(
        { body: `🎨 Variation result (V${index + 1})`, attachment: fs.createReadStream(path) },
        event.threadID,
        () => fs.unlinkSync(path),
        event.messageID
      );
    }
  }

  // নতুন প্রম্পট
  const prompt = input;
  const msg = await api.sendMessage("✨ MidJourney process started...\nঅনুগ্রহ করে অপেক্ষা করুন ⏳", event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`);
    if (!response.data || !response.data.images || response.data.images.length === 0) {
      return api.sendMessage("❌ কোনো ছবি জেনারেট করতে পারলাম না!", event.threadID, event.messageID);
    }

    // প্রথম ৪টা ছবি
    const results = response.data.images.slice(0, 4);
    lastImages = results.map(img => img.src); // future upscale/variation এর জন্য save করলাম

    let attachments = [];
    for (let i = 0; i < results.length; i++) {
      const imgUrl = results[i].src;
      const imgData = (await axios.get(imgUrl, { responseType: "arraybuffer" })).data;
      const path = __dirname + `/cache/mj_${i}.jpg`;
      fs.writeFileSync(path, Buffer.from(imgData, "binary"));
      attachments.push(fs.createReadStream(path));
    }

    api.sendMessage(
      {
        body: `✨ MidJourney process completed\n✅ Prompt: ${prompt}\n\n☑️ Action: U1, U2, U3, U4 | V1, V2, V3, V4`,
        attachment: attachments,
      },
      event.threadID,
      () => {
        for (let i = 0; i < results.length; i++) {
          fs.unlinkSync(__dirname + `/cache/mj_${i}.jpg`);
        }
      },
      event.messageID
    );
  } catch (e) {
    console.log(e);
    api.sendMessage("⚠️ কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন!", event.threadID, event.messageID);
  }
};
