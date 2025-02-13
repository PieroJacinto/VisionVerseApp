import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import * as process from 'process';

const getCallbackURL = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseURL = isProduction 
    ? process.env.FRONTEND_URL_PROD 
    : 'http://localhost:3000';
  
  // Log para debugging
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Base URL:', baseURL);
  
  const callbackURL = `${baseURL}/api/auth/google/callback`;
  console.log('Callback URL:', callbackURL);
  
  return callbackURL;
};

export const configurePassport = () => {
  // Serialización
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

  // Configuración de la estrategia de Google
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: getCallbackURL(),
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
};