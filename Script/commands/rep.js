module.exports.config = {
  name: "rep",
  version: "1.0.0",
  permission: 0,
  credits: "safe-version",
  description: "Start repeating messages until stopped",
  category: "system",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;

  // global object এ আগের লুপগুলো ট্র্যাক করি
  if (!global.clientIntervals) global.clientIntervals = {};

  // যদি আগে থেকেই চলতে থাকে তাহলে জানানো হবে
  if (global.clientIntervals[threadID]) {
    return api.sendMessage("এই চ্যাটে ইতিমধ্যেই রিপিট শুরু আছে। `/stop` লিখে থামাতে পারো 🐸", threadID);
  }

  // এখানে তোমার মেসেজ লিস্ট
  const messages = [
    "হ্যালো সবাই 👋",
    "কেমন আছো? আশা করি ভালো আছো 🌸",
    "পানি খেতে ভুলো না 💧",
    "হাসিখুশি থেকো 🐸",
    "তুমি দারুণ কাজ করতে পারবে 💪"
  ];

  let idx = 0;

  // সাথে সাথে প্রথম মেসেজ পাঠাও
  await api.sendMessage(messages[idx], threadID);

  // প্রতি 10 সেকেন্ড পর পর মেসেজ পাঠাবে
  const intervalId = setInterval(() => {
    idx = (idx + 1) % messages.length;
    api.sendMessage(messages[idx], threadID);
  }, 10000);

  // global object এ সেভ করে রাখো যাতে পরে বন্ধ করা যায়
  global.clientIntervals[threadID] = intervalId;
};
