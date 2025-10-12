module.exports.config = {
  name: "trigger",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "NTKhang (Modified by Rahat)",
  description: "Tạo hiệu ứng Triggered từ avatar người dùng",
  commandCategory: "hình ảnh",
  usages: "trigger || trigger @tag",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "discord.js": "",
    "discord-image-generation": "",
    "node-superfetch": ""
  }
};

module.exports.run = async ({ event, api, args }) => {
  try {
    const DIG = global.nodemodule["discord-image-generation"];
    const Discord = global.nodemodule["discord.js"];
    const request = global.nodemodule["node-superfetch"];
    const fs = global.nodemodule["fs-extra"];

    // যদি কেউ ট্যাগ করে, তাহলে সেই ব্যক্তির ID নেওয়া হবে, না হলে নিজেই
    const id = Object.keys(event.mentions)[0] || event.senderID;

    // প্রোফাইল পিকচার নিয়ে আসা
    const avatar = (await request.get(
      `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
    )).body;

    // Trigger effect তৈরি করা
    const img = await new DIG.Triggered().getImage(avatar);

    // GIF ফাইল সেভ করা
    const path_trigger = __dirname + "/cache/trigger.gif";
    fs.writeFileSync(path_trigger, img);

    // প্রথমে টেক্সট মেসেজ পাঠাও, তারপর GIF
    api.sendMessage("😡 Triggered!", event.threadID, () => {
      api.sendMessage(
        { attachment: fs.createReadStream(path_trigger) },
        event.threadID,
        () => fs.unlinkSync(path_trigger),
        event.messageID
      );
    });
  } catch (e) {
    console.log(e);
    return api.sendMessage("❌ কিছু একটা ভুল হয়েছে!", event.threadID, event.messageID);
  }
};
