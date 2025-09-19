module.exports.config = {
  name: "repeat",       // কমান্ডের নাম
  version: "1.0.0",
  permission: 0,        // সবাই ব্যবহার করতে পারবে
  credits: "safe-version",
  description: "Start repeating safe messages",
  category: "fun",
  usages: "/repeat",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;

  if (!global.clientIntervals) global.clientIntervals = {};

  if (global.clientIntervals[threadID]) {
    return api.sendMessage("এই চ্যাটে রিপিট ইতিমধ্যেই চলছে 🐸\n/stop টাইপ করলে থামবে।", threadID);
  }

  const messages = [
    "হ্যালো সবাই 🌸",
    "কেমন আছো? আশা করি ভালো আছো 😊",
    "আজকের দিনটা সুন্দর হোক 💫",
    "হাসিখুশি থাকো 🐸",
    "পড়াশোনা করতে ভুলো না 📚"
  ];

  let idx = 0;
  await api.sendMessage(messages[idx], threadID);

  const intervalId = setInterval(() => {
    idx = (idx + 1) % messages.length;
    api.sendMessage(messages[idx], threadID);
  }, 10000);

  global.clientIntervals[threadID] = intervalId;
};
