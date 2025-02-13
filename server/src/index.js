import * as process from 'process';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { configurePassport } from './config/passport.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL_DEV,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// Rutas

// Al inicio de todas las rutas
app.use((req, res, next) => {
  console.log('Recibida petición:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    host: req.headers.host
  });
  next();
});
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('Ambiente:', process.env.NODE_ENV || 'development');
  console.log('URL Frontend:', process.env.FRONTEND_URL_DEV);
});

export default app;