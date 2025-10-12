module.exports.config = {
    name: "cardgroup",
    version: "1.0.0",
    hasPermssion: 0, // Users
    credits: "D-Jukie, John Lester",
    description: "Create a group information card",
    commandCategory: "Info",
    usages: ["", "[text]"],
    cooldowns: 30
};

module.exports.run = async function({ api, event, args, Users, Threads, umaru, kernel, getUsers }) {
    try {
        let text = args.join(" "); // ইউজারের লেখা
        let data = await getUsers(event.threadID); // থ্রেডের ইউজার ডাটা

        let m = []; // পুরুষ
        let f = []; // মহিলা
        let n = []; // অজানা লিঙ্গ
        let admin = []; // অ্যাডমিন

        for (const item in data) {
            if (data[item].gender === "MALE") m.push(item);
            else if (data[item].gender === "FEMALE") f.push(item);
            else n.push(item);

            if (data[item].lastActive === "Administrator") admin.push(item);
        }

        await umaru.createJournal(event);

        // র‍্যান্ডম ইউজারের প্রোফাইল ছবি
        const av1 = admin.length > 0 ? await Users.getImage(admin[Math.floor(Math.random() * admin.length)]) : null;
        const av2 = await Users.getImage(event.participantIDs[Math.floor(Math.random() * event.participantIDs.length)]);
        const av3 = await Users.getImage(event.participantIDs[Math.floor(Math.random() * event.participantIDs.length)]);
        const tav1 = await Threads.getImage(event.threadID);
        const threadName = await Threads.getName(event.threadID);
        const messageCount = umaru.data.threads[event.threadID]?.messageCount || 0;

        const cardImage = await kernel.readStream(["cardgroup"], {
            key: null,
            m: m,
            f: f,
            n: n,
            participants: event.participantIDs,
            admin: admin,
            messageCount: messageCount,
            av1: av1,
            av2: av2,
            av3: av3,
            tav1: tav1,
            threadName: threadName,
            text: text
        });

        return api.sendMessage({ body: text || "", attachment: cardImage }, event.threadID, async () => {
            await umaru.deleteJournal(event);
        }, event.messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage("⚠️ কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }
};
