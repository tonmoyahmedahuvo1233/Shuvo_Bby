const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "antichange_data");

if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);

module.exports.config = {
    name: "antichange",
    version: "1.0.0",
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    hasPermssion: 2,
    description: "Turn off antichange",
    usages: "antijoin on/off",
    commandCategory: "system",
    cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
    const threadID = event.threadID;
    const file = path.join(dataPath, `${threadID}.json`);

    if (args[0] === "on") {
        fs.writeFileSync(file, JSON.stringify({
            protect: true,
            name: "",
            image: ""
        }, null, 2));
        api.sendMessage("🛡️ Anti-change system activated for this group!", threadID);
    } 
    else if (args[0] === "off") {
        if (fs.existsSync(file)) fs.unlinkSync(file);
        api.sendMessage("❌ Anti-change system disabled.", threadID);
    } 
    else {
        api.sendMessage("🔧 Use: antichange on / off", threadID);
    }
};

// when someone changes group info
module.exports.handleEvent = async function({ api, event }) {
    try {
        const threadID = event.threadID;
        const file = path.join(__dirname, "antichange_data", `${threadID}.json`);
        if (!fs.existsSync(file)) return;
        
        const data = JSON.parse(fs.readFileSync(file));
        if (!data.protect) return;

        const info = await api.getThreadInfo(threadID);
        const admins = info.adminIDs.map(a => a.id);

        if (!admins.includes(event.author)) {
            // someone else tried to change name or image
            if (event.logMessageType === "log:thread-name") {
                await api.setTitle(data.name || info.threadName, threadID);
                api.sendMessage("🚫 Group name change blocked! Admin only.", threadID);
            }
            if (event.logMessageType === "log:thread-image") {
                if (data.image) {
                    const stream = fs.createReadStream(data.image);
                    await api.changeGroupImage(stream, threadID);
                    api.sendMessage("🚫 Group image change blocked! Admin only.", threadID);
                }
            }
        } else {
            // save admin-approved changes
            if (event.logMessageType === "log:thread-name") {
                data.name = info.threadName;
            }
            if (event.logMessageType === "log:thread-image") {
                const imgPath = path.join(__dirname, "antichange_data", `${threadID}_image.png`);
                const image = await api.getCurrentUserProfilePicture();
                fs.writeFileSync(imgPath, image);
                data.image = imgPath;
            }
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error(err);
    }
};
