module.exports.config = {
  name: "fbcover",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rahat (Modified)",
  description: "বাংলায় FB Cover তৈরি করুন",
  commandCategory: "Image",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, args, event }) {
  const { threadID, messageID, senderID } = event;
  const axios = require("axios");
  const fs = require("fs-extra");
  const request = require("request");

  if(args[0] == "list") {
    const res = await axios.get("https://api.nguyenmanh.name.vn/taoanhdep/list");
    let page = parseInt(args[1]) || 1;
    if(page < 1) page = 1;
    const limit = 11;
    const total = res.data.listAnime.length;
    const totalPages = Math.ceil(total / limit);
    let msg = "";
    for(let i = limit * (page-1); i < limit*page; i++){
      if(i >= total) break;
      msg += `${i+1}. ${res.data.listAnime[i].name}\n`;
    }
    msg += `» মোট চরিত্র: ${total}\n» পৃষ্ঠা (${page}/${totalPages})\n» পরবর্তী পৃষ্ঠা দেখতে /fbcover list <page>`;
    return api.sendMessage(`●─●চরিত্র তালিকা●─●\n${msg}\n●──●শেষ●──●`, threadID, messageID);
  }

  else if(args[0] == "find"){
    let char = args[1];
    if(!char) return api.sendMessage("চরিত্রের নাম লিখুন।", threadID, messageID);
    const res = await axios.get(`https://api.nguyenmanh.name.vn/taoanhdep/search?key=${encodeURIComponent(char)}`);
    let id = res.data.ID;
    return api.sendMessage(`${char} এর ID হলো: ${id}`, threadID, messageID);
  }

  else if(args[0] == "color"){
    const url = "https://4.bp.blogspot.com/-_nVsmtO-a8o/VYfZIUJXydI/AAAAAAAACBQ/FHfioHYszpk/w1200-h630-p-k-no-nu/cac-mau-trong-tieng-anh.jpg";
    const path = __dirname + `/cache/colors.jpg`;
    const callback = () => {
      api.sendMessage({ body: "রঙের তালিকা:", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path));
    }
    request(encodeURI(url)).pipe(fs.createWriteStream(path)).on("close", callback);
  }

  else {
    return api.sendMessage(`» চরিত্রের ID দিয়ে reply করুন যা আপনি ব্যবহার করতে চান।`, threadID, (error, info) => {
      return global.client.handleReply.push({
        type: "characters",
        name: this.config.name,
        author: senderID,
        messageID: info.messageID
      })
    }, messageID);
  }
}

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, senderID } = event;
  const axios = require("axios");

  if(handleReply.author != senderID) return api.sendMessage("আপনি এই মেসেজের উত্তর দেওয়ার অনুমতি নেই।", threadID);

  switch(handleReply.type){
    case "characters": {
      const res = await axios.get(`https://api.nguyenmanh.name.vn/taoanhdep/search/id?id=${event.body}`);
      const name = res.data.name;
      api.unsendMessage(handleReply.messageID);
      return api.sendMessage(`» আপনি নির্বাচন করেছেন: ${name}\n» এবার reply করুন আপনার নাম লিখতে।`, threadID, (error, info) => {
        return global.client.handleReply.push({
          type: "subname",
          name: handleReply.name,
          author: senderID,
          characters: event.body,
          messageID: info.messageID
        })
      }, messageID);
    }
    case "subname": {
      api.unsendMessage(handleReply.messageID);
      return api.sendMessage(`» এবার reply করুন আপনার background color।\n» রঙের তালিকা দেখতে /fbcover color লিখুন।`, threadID, (error, info) => {
        return global.client.handleReply.push({
          type: "color",
          name: handleReply.name,
          author: senderID,
          characters: handleReply.characters,
          name_s: event.body,
          messageID: info.messageID
        })
      }, messageID);
    }
    case "color": {
      api.unsendMessage(handleReply.messageID);
      return api.sendMessage(`» Banner তৈরি করা হচ্ছে...`, threadID, async (error, info) => {
        const idchar = handleReply.characters;
        const name_ = handleReply.name_s;
        const color_ = event.body;
        const imag = (await axios.get(`https://api.nguyenmanh.name.vn/fbcover/v2?name=${encodeURIComponent(name_)}&id=${idchar}&subname=${encodeURIComponent(name_)}&color=${encodeURIComponent(color_)}&apikey=KeyTest`, { responseType: "stream" })).data;
        return api.sendMessage({ body: "আপনার FB Cover এখানে:", attachment: imag }, threadID, messageID);
      });
    }
  }
}
