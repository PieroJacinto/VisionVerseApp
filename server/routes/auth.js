import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();
const router = express.Router();

const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL_PROD
  : process.env.FRONTEND_URL_DEV || 'http://localhost:5173';

// Ruta para verificar estado de autenticación
router.get('/check-auth', (req, res) => {
  console.log('Verificando autenticación:', req.isAuthenticated());
  console.log('Usuario en sesión:', req.user);
  
  if (req.isAuthenticated() && req.user) {
    res.json({
      isAuthenticated: true,
      user: {
        email: req.user.email,
        displayName: req.user.displayName
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.get('/google',
  (req, res, next) => {
    console.log('Iniciando autenticación con Google');
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  (req, res, next) => {
    console.log('Callback de Google recibido en auth.js');
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('Error en autenticación:', err);
        return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
      }
      
      if (!user) {
        console.log('No se encontró usuario');
        return res.redirect(`${FRONTEND_URL}/login?error=unauthorized`);
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Error en login:', err);
          return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
        }
        
        console.log('Usuario autenticado exitosamente, redirigiendo a welcome');
        return res.redirect(`${FRONTEND_URL}/welcome`);
      });
    })(req, res, next);
  }
);

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

export default router;