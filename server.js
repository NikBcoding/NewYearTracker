const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'dev-secret', resave: false, saveUninitialized: false }));

// In-memory user store (for demo). Default user: alice / 1234
const users = [
  { username: 'alice', pinHash: bcrypt.hashSync('1234', 10) }
];

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/login');
}

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, pin } = req.body;
  if (!username || !pin) return res.render('login', { error: 'Missing username or PIN.' });
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(pin, user.pinHash)) return res.render('login', { error: 'Invalid credentials.' });
  req.session.user = { username };
  res.redirect('/dashboard');
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
