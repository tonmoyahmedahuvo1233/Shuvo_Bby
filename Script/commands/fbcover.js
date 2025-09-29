const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports.config = {
  name: "fbcover",
  version: "1.0.0",
  permission: 0,
  credits: "Mohammad Nayan",
  description: "Generate FB cover",
  category: "fbcover",
  cooldowns: 2,
};

module.exports.run = async function({ bot, event, args, Users }) {
  const uid = event.sender.id; // Mirai style
  const info = args.join(" ");

  const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
  const n = apis.data.api;

  var id = event.mentions[0]?.id || uid; // Mirai mentions style
  var nam = await Users.getNameUser(id);

  if (!info) {
    return bot.sendMessage({
      target: event.thread.id,
      message: "Please enter in the format:\nfbcover name - subname - address - email - phone nbr - color (default = no)"
    });
  } else {
    const msg = info.split("-");
    const name = msg[0].trim();
    const subname = msg[1].trim();
    const address = msg[2].trim();
    const email = msg[3].trim();
    const phone = msg[4].trim();
    const color = msg[5].trim() || "no";

    bot.sendMessage({
      target: event.thread.id,
      message: "Processing your cover, please wait..."
    });

    const img = `${n}/fbcover/v1?name=${encodeURIComponent(name)}&uid=${id}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(phone)}&color=${encodeURIComponent(color)}`;

    try {
      const response = await axios.get(img, { responseType: 'arraybuffer' });
      const image = await jimp.read(response.data);
      const outputPath = `./fbcover_${uid}.png`;
      await image.writeAsync(outputPath);

      await bot.sendMessage({
        target: event.thread.id,
        message: `◆━━━━━━━━◆◆━━━━━━━━◆\n🔴INPUT NAME: ${name}\n🔵INPUT SUBNAME: ${subname}\n📊ADDRESS: ${address}\n✉️EMAIL: ${email}\n☎️PHONE NO.: ${phone}\n🎇COLOUR: ${color}\n🆔ID: ${nam}\n◆━━━━━━━━◆◆━━━━━━━━◆`,
        image: fs.createReadStream(outputPath)
      });

      fs.unlinkSync(outputPath);
    } catch (error) {
      console.error(error);
      bot.sendMessage({
        target: event.thread.id,
        message: "An error occurred while generating the FB cover."
      });
    }
  }
};
