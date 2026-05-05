require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

console.log(process.env.GOOGLE_CLIENT_ID); // Just to verify env variables are loaded
process.env.GOOGLE_CLIENT_ID;
process.env.GOOGLE_CLIENT_SECRET;
process.env.SESSION_SECRET;

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
//const { name } = require('ejs');
const users = []; // In-memory user store

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(session({ secret: 'dev-secret', resave: false, saveUninitialized: false }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {

  const email = profile.emails && profile.emails[0] && profile.emails[0].value;

  let user = users.find(u => u.googleId === profile.id);

  if (!user) {
    user = {
      id: profile.id,
      googleId: profile.id,
      name: profile.displayName,
      username: profile.displayName,
      email: email,
      passwordHash: null,
      points: 0,
    };
    users.push(user);
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id); // Replace with your user retrieval logic
  done(null, user);
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});
app.post('/register', async (req, res) => {
  const { name, username, password, confirmPassword } = req.body;
  if (!name || !username || !password || !confirmPassword) {
    return res.render('register', { error: 'Please fill in all fields.' });
  }
  if (password !== confirmPassword) {
    return res.render('register', { error: 'Passwords do not match.' });
  }

  const existingUser = users.find(
    user => user.username === username
  );

  if (existingUser) {
    return res.render('register', { 
      error: 'Username already exists.' 
    });
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    name,
    username,
    email: null,
    passwordHash,
    googleId: null,
    points: 0,
  };

  users.push(newUser);
  res.redirect('/login');
  // Additional validation and user creation logic would go here
});

app.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

function requireAuth(req, res, next) {
  if (req.session.user && req.session.user) { 
    return next();
  }

  if(req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  (req, res) => {
    //res.session.user = req.user
    res.redirect('/dashboard');
  // Successful authentication
});

app.post('/logout', (req, res, next) => {
  req.session.user = null; // manual username/password login

  if(req.isAuthenticated && req.isAuthenticated()) {
    // Passport logout
    req.logout(function(err) {
      if (err) return next(err);

      req.session.destroy(() => {
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/login');
      });
    });
  } else {
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('/login');
    });
  }
  });

  app.get('/dashboard', requireAuth, (req, res) => {
    const user = req.session.user && req.session.user || req.user; // Support both session and passport user

    res.render('dashboard', {
      user: user
    });
  });


app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.render('login', { error: 'Invalid username or password.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return res.render('login', { error: 'Invalid username or password.' });
  }

  req.session.user = user;
  return res.redirect('/dashboard');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
