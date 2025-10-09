const fs = require("fs");
const path = require("path");

const cacheFolder = path.join(__dirname, "../cache");
if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

module.exports.config = {
    name: "eventlistener",
    eventType: ["log:thread-name", "log:thread-image"],
    version: "1.0.0",
    credits: "Akash × ChatGPT",
    description: "Prevent non-admins from changing group name or profile picture",
};

module.exports.run = async function({ api, event }) {
    const threadID = event.threadID;
    const author = event.author;
    const file = path.join(cacheFolder, `${threadID}.json`);

    if (!fs.existsSync(file)) return;

    const lockedData = JSON.parse(fs.readFileSync(file, "utf8"));
    const info = await api.getThreadInfo(threadID);
    const admins = info.adminIDs.map(a => a.id);

    if (!admins.includes(author)) {
        // Non-admin changed something → revert
        if (event.logMessageType === "log:thread-name" && lockedData.name) {
            await api.setTitle(lockedData.name, threadID);
            api.sendMessage("⚠️ গ্রুপ নাম লক করা আছে! শুধু এডমিন পরিবর্তন করতে পারবে।", threadID);
        }

        if (event.logMessageType === "log:thread-image" && lockedData.imageSrc) {
            await api.changeGroupImage(lockedData.imageSrc, threadID);
            api.sendMessage("⚠️ গ্রুপ প্রোফাইল লক করা আছে! শুধু এডমিন পরিবর্তন করতে পারবে।", threadID);
        }
    } else {
        // Admin → সংরক্ষণ করুন
        const newData = {
            imageSrc: info.imageSrc || lockedData.imageSrc,
            name: info.threadName || lockedData.name
        };
        fs.writeFileSync(file, JSON.stringify(newData, null, 2));
    }
};
