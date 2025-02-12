import { config } from 'dotenv';
import * as process from 'process';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authRoutes from './routes/auth.js';

config();

const app = express();

// Configuración de CORS mejorada
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL_DEV || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configuración mejorada de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Cambiar a true en producción con HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serialización mejorada
passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    email: user.emails[0].value,
    displayName: user.displayName
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? `${process.env.BACKEND_URL}/auth/google/callback`
    : 'http://localhost:3000/auth/google/callback',
  proxy: true
},
function(accessToken, refreshToken, profile, done) {
  console.log('Estrategia Google ejecutándose');
  console.log('Email recibido:', profile.emails[0].value);
  
  const userEmail = profile.emails[0].value;
  if (userEmail === 'pierojacinto@gmail.com') {
    console.log('Email autorizado, procediendo con la autenticación');
    return done(null, profile);
  } else {
    console.log('Email NO autorizado:', userEmail);
    return done(null, false, { message: 'Email no autorizado' });
  }
}));

// Middleware para logging de sesión
app.use((req, res, next) => {
  console.log('Sesión:', req.session);
  console.log('Usuario autenticado:', req.isAuthenticated());
  next();
});

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));