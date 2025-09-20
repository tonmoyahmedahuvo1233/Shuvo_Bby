module.exports.config = {
    name: "fork",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU (Modified by Rahat)",
    description: "Send GitHub repo link with loading animation",
    commandCategory: "other",
    usages: "fork",
    cooldowns: 3,
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;

    // Step 1: প্রথম message পাঠানো
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

                // 1 সেকেন্ড পরে message delete + GitHub link পাঠানো
                setTimeout(() => {
                    api.unsendMessage(progressMsgID);
                    api.sendMessage(
                        "🔗 GitHub Repo Link:\n\nhttps://github.com/Rahat-Boss/Rahat_Bot.git",
                        threadID,
                        messageID
                    );
                }, 1000);
                return;
            }

            const filledBlocks = "█".repeat(step);
            const emptyBlocks = "▒".repeat(progressBarLength - step);
            const spark = step % 2 === 0 ? "✨" : "💎";
            const percent = step * 10;

            api.editMessage(`${filledBlocks}${emptyBlocks} ${percent}% ${spark}`, progressMsgID, threadID);

        }, interval);
    });
};
