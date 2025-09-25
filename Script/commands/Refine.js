const axios = require('axios');
const dipto = "https://www.noobs-api.rf.gd/dipto";

module.exports.config = {
  name: "refine",
  version: "6.9",
  credits: "dipto",
  countDown: 5,
  hasPermssion: 1,
  category: "AI",
  commandCategory: "AI",
  description: "Edit images using Edit AI",
  guide: {
    en: "Reply to an image with {pn} [prompt]"
  }
};

async function handleEdit(api, event, args, commandName, waitMsgID = null) {
  const url = event.messageReply?.attachments[0]?.url;
  const prompt = args.join(" ") || "What is this";

  if (!url) {
    if (waitMsgID) api.unsendMessage(waitMsgID);
    return api.sendMessage("❌ Please reply to an image to edit it.", event.threadID, event.messageID);
  }

  try {
    const response = await axios.get(`${dipto}/edit?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}`, {
      responseType: 'stream',
      validateStatus: () => true
    });

    // API রেসপন্স যদি ইমেজ হয়
    if (response.headers['content-type']?.startsWith('image/')) {
      if (waitMsgID) api.unsendMessage(waitMsgID);
      return api.sendMessage(
        { attachment: response.data },
        event.threadID,
        (error, info) => {
          global.client.handleReply.push({
            name: commandName,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
          });
        },
        event.messageID
      );
    }

    // API রেসপন্স যদি JSON হয়
    let responseData = '';
    for await (const chunk of response.data) {
      responseData += chunk.toString();
    }

    const jsonData = JSON.parse(responseData);
    if (jsonData?.response) {
      if (waitMsgID) api.unsendMessage(waitMsgID);
      return api.sendMessage(
        jsonData.response,
        event.threadID,
        (error, info) => {
          global.client.handleReply.push({
            name: commandName,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
          });
        },
        event.messageID
      );
    }

    if (waitMsgID) api.unsendMessage(waitMsgID);
    return api.sendMessage(
      "❌ No valid response from the API",
      event.threadID,
      event.messageID
    );

  } catch (error) {
    console.error("Edit command error:", error);
    if (waitMsgID) api.unsendMessage(waitMsgID);
    return api.sendMessage(
      "❌ Failed to process your request. Please try again later.",
      event.threadID,
      event.messageID
    );
  }
}

module.exports.run = async ({ api, event, args }) => {
  if (!event.messageReply) {
    return api.sendMessage(
      "❌ Please reply to an image to edit it.",
      event.threadID,
      event.messageID
    );
  }

  // Please wait মেসেজ পাঠাও
  api.sendMessage("⏳ Please wait...", event.threadID, async (err, info) => {
    if (err) return;
    await handleEdit(api, event, args, module.exports.config.name, info.messageID);
  }, event.messageID);
};

module.exports.handleReply = async function ({ api, event, args }) {
  if (event.type === "message_reply") {
    // Please wait মেসেজ পাঠাও
    api.sendMessage("⏳ Please wait...", event.threadID, async (err, info) => {
      if (err) return;
      await handleEdit(api, event, args, this.config.name, info.messageID);
    }, event.messageID);
  }
};
