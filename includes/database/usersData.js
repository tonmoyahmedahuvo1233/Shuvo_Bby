const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../data/usersData.json");

function loadDB() {
  if (!fs.existsSync(dbPath)) return [];
  return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function getUser(uid) {
  const db = loadDB();
  let user = db.find(u => u.id === uid);
  if (!user) {
    user = { id: uid, name: "Unknown", money: 0, exp: 0, data: {} };
    db.push(user);
    saveDB(db);
  }
  return user;
}

function setUser(uid, newData) {
  const db = loadDB();
  let user = db.find(u => u.id === uid);
  if (!user) {
    user = { id: uid, name: "Unknown", money: 0, exp: 0, data: {} };
    db.push(user);
  }
  Object.assign(user, newData);
  saveDB(db);
  return user;
}

function addMoney(uid, amount) {
  const user = getUser(uid);
  user.money += amount;
  setUser(uid, user);
  return user.money;
}

function subtractMoney(uid, amount) {
  const user = getUser(uid);
  user.money = Math.max(0, user.money - amount);
  setUser(uid, user);
  return user.money;
}

function getAll() {
  return loadDB();
}

module.exports = {
  getUser,
  setUser,
  addMoney,
  subtractMoney,
  getAll
};
