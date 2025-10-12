module.exports.config = {
 name: "triggered",
 version: "1.0.2",
 hasPermssion: 0,
 credits: "🔰𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁🔰",
 description: "Get Facebook UID and profile links",
 commandCategory: "utility",
 cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users, kernel }) {
    try {
        // কোন ইউজারের ছবি নেবে সেটা চেক করা
        let mentions = Object.keys(event.mentions);
        let targetID;

        if (event.type === "message_reply" && event.messageReply.attachments.length > 0 && event.messageReply.attachments[0].type === "photo") {
            targetID = await kernel.readImageFromURL(event.messageReply.attachments[0].url);
        } else if (mentions.length > 0) {
            targetID = await Users.getImage(mentions[0]);
        } else {
            targetID = await Users.getImage(event.senderID);
        }

        // Triggered ইফেক্ট প্রোসেস করা
        const triggeredImage = await kernel.readStream(["triggered"], { targetID: targetID });

        // মেসেজ পাঠানো
        return api.sendMessage({
            body: "Here’s your triggered pic!",
            attachment: triggeredImage
        }, event.threadID, event.messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage("⚠️ কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }
};
