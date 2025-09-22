module.exports.config = {
  name: "reactDelete",
  eventType: ["message_reaction"], // শুধু রিঅ্যাক্ট ইভেন্ট ধরবে
  version: "1.0.1",
  credits: "Rahat_Bot",
  description: "Admin ❤️ react দিলে বটের মেসেজ ডিলিট করে"
};

module.exports.run = async function({ api, event, Config }) {
  try {
    const adminList = Config.ADMINBOT || []; // config.json এর ADMINBOT array

    // চেক করুন ইউজার অ্যাডমিন কিনা
    if (!adminList.includes(event.userID)) return;

    // চেক করুন রিঅ্যাক্ট ❤️ কিনা
    if (event.reaction !== "❤") return;

    // রিঅ্যাক্ট করা মেসেজের ইনফো বের করা
    const msgInfo = await api.getMessageInfo(event.messageID);

    // যদি মেসেজটা বট পাঠায়, তখন ডিলিট করবে
    if (msgInfo.message && msgInfo.message.senderID == api.getCurrentUserID()) {
      await api.unsendMessage(event.messageID);
      console.log("❤️ react detected from admin -> message deleted");
    }

  } catch (err) {
    console.log("reactDelete error:", err);
  }
};
