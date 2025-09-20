const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "help",
    version: "2.0.4",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU (Modified by Rahat)",
    description: "Shows all commands with details",
    commandCategory: "system",
    usages: "[command name/page number]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": `╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Usage: %2
┃ 📜 Description: %3
┃ 🔑 Permission: %4
┃ 👨‍💻 Credit: %5
┃ 📂 Category: %6
┃ ⏳ Cooldown: %7s
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: %8
┃ 🤖 Bot Name: %9
┃ 👑 Owner👉 m.me/61561511477968
╰━━━━━━━━━━━━━━━━╯`,
        "helpList": "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]",
        "user": "User",
        "adminGroup": "Admin Group",
        "adminBot": "Admin Bot"
    }
};

// ✅ ভিডিও path
const videoPath = path.resolve("help.mp4");
function getVideoAttachment() {
    return fs.existsSync(videoPath) ? [fs.createReadStream(videoPath)] : [];
}

// ============================
// 🔹 handleEvent
// ============================
module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || !body.startsWith("help")) return;
    const args = body.trim().split(/\s+/);
    if (args.length < 2 || !commands.has(args[1].toLowerCase())) return;

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const command = commands.get(args[1].toLowerCase());
    const prefix = threadSetting.PREFIX || global.config.PREFIX;

    const detail = getText("moduleInfo",
        command.config.name,
        command.config.usages || "Not Provided",
        command.config.description || "Not Provided",
        command.config.hasPermssion,
        command.config.credits || "Unknown",
        command.config.commandCategory || "Unknown",
        command.config.cooldowns || 0,
        prefix,
        global.config.BOTNAME || "🔰 𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁 🔰"
    );

    api.sendMessage({ body: detail, attachment: getVideoAttachment() }, threadID, messageID);
};

// ============================
// 🔹 run function with sparkle animation
// ============================
module.exports.run = async function({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const prefix = threadSetting.PREFIX || global.config.PREFIX;

    api.sendMessage("▒▒▒▒▒▒▒▒▒▒ 0% ✨", threadID, async (err, info) => {
        if (err) return console.error(err);
        const progressMsgID = info.messageID;

        let step = 0;
        const interval = 120; // smooth & fast
        const progressBarLength = 10;

        const progressInterval = setInterval(() => {
            step += 1;
            if (step > 10) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    api.unsendMessage(progressMsgID);
                    sendHelpInfo(api, threadID, messageID, args, getText, prefix, commands);
                }, 1000);
                return;
            }

            const filledBlocks = "█".repeat(step);
            const emptyBlocks = "▒".repeat(progressBarLength - step);

            // Spark effect
            const spark = step % 2 === 0 ? "✨" : "💎";
            const percent = step * 10;
            api.editMessage(`${filledBlocks}${emptyBlocks} ${percent}% ${spark}`, progressMsgID, threadID);

        }, interval);
    });
};

// ============================
// 🔹 মূল help info function
// ============================
function sendHelpInfo(api, threadID, messageID, args, getText, prefix, commands) {
    if (args[0] && commands.has(args[0].toLowerCase())) {
        const command = commands.get(args[0].toLowerCase());
        const detailText = getText("moduleInfo",
            command.config.name,
            command.config.usages || "Not Provided",
            command.config.description || "Not Provided",
            command.config.hasPermssion,
            command.config.credits || "Unknown",
            command.config.commandCategory || "Unknown",
            command.config.cooldowns || 0,
            prefix,
            global.config.BOTNAME || "🔰 𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁 🔰"
        );

        api.sendMessage({ body: detailText, attachment: getVideoAttachment() }, threadID, messageID);
        return;
    }

    const arrayInfo = Array.from(commands.keys()).filter(Boolean).sort();
    const page = Math.max(parseInt(args[0]) || 1, 1);
    const numberOfOnePage = 180;
    const totalPages = Math.ceil(arrayInfo.length / numberOfOnePage);
    const start = numberOfOnePage * (page - 1);
    const helpView = arrayInfo.slice(start, start + numberOfOnePage);

    const msg = helpView.map(cmdName => `┃ ✪ ${cmdName}`).join("\n");

    const text = `╭━━━━━━━━━━━━━━━━╮
┃ 🔰 𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁 🔰
┃📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 📜
┣━━━━━━━━━━━━━━━┫
┃ 📄 Page: ${page}/${totalPages}
┃ 🧮 Total: ${arrayInfo.length}
┣━━━━━━━━━━━━━━━━┫
${msg}
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot Name: ${global.config.BOTNAME || "🔰𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁🔰"}
┃ 👑 Owner👉 m.me/61561511477968
╰━━━━━━━━━━━━━━━━╯`;

    api.sendMessage({ body: text, attachment: getVideoAttachment() }, threadID, messageID);
}
