// server/server.js
import { config } from 'dotenv';
import * as process from 'process';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authRoutes from './routes/auth.js';

config(); // Inicializa dotenv

// Resto de tu código...



const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://visionverse-rouge.vercel.app'
    : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
      ? 'https://visionverse-rouge.vercel.app/auth/google/callback'
      : 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    if (profile.emails[0].value === 'pierojacinto@gmail.com') {
      return cb(null, profile);
    }
    return cb(null, false, { message: 'Email no autorizado' });
  }
));

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));