const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { findByEmail, insertUser } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, and password are required' });
  }
  if (findByEmail(email)) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  insertUser({ id: crypto.randomUUID(), username, email, password: hashed, createdAt: new Date().toISOString() });
  res.status(201).json({ message: 'User registered' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  const user = findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, username: user.username });
});

app.get('/api/auth/verify', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ valid: false, message: 'Missing bearer token' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, userId: payload.userId, username: payload.username, expiresAt: payload.exp });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TorrentEdge auth service running on port ${PORT}`);
});
