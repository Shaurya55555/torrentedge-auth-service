const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'users.json');

function readUsers() {
  if (!fs.existsSync(DB_PATH)) return [];
  const raw = fs.readFileSync(DB_PATH, 'utf-8').trim();
  if (!raw) return [];
  return JSON.parse(raw);
}

function writeUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

function findByEmail(email) {
  return readUsers().find((u) => u.email === email);
}

function insertUser(user) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  return user;
}

module.exports = { readUsers, findByEmail, insertUser };
