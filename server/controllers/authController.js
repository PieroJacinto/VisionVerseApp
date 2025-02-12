import passport from 'passport';
import * as process from 'process';

const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL_PROD
  : process.env.FRONTEND_URL_DEV || 'http://localhost:5173';

class AuthController {
  checkAuth(req, res) {
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
  }

  initiateGoogleAuth(req, res, next) {
    console.log('Iniciando autenticación con Google');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  }

  handleGoogleCallback(req, res, next) {
    console.log('Callback de Google recibido');
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

  logout(req, res) {
    req.logout(() => {
      res.json({ success: true });
    });
  }
}

export default new AuthController();