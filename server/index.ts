import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import ordersRoutes from './routes/orders.routes';
import couponsRoutes from './routes/coupons.routes';
import usersRoutes from './routes/users.routes';
import newsletterRoutes from './routes/newsletter.routes';
import paymentsRoutes from './routes/payments.routes';
import uploadsRoutes from './routes/uploads.routes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CONFIGURACIÓN CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://mi-estrella-app.onrender.com', // Ajusta según tu URL de Render
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie']
}));

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payments', paymentsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // Catch all handler: enviar index.html para rutas del frontend
  app.get('*', (req, res) => {
    // Solo para rutas que no empiecen con /api
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'API route not found' });
    }
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler para rutas API no encontradas
app.use('/api/*', (req, res) => {
  console.log(`❌ 404 - API route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'API route not found' });
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   🌟 Mi Estrella - Server                ║
╚══════════════════════════════════════════╝
🚀 Server:      http://localhost:${PORT}
📦 Environment: ${process.env.NODE_ENV || 'development'}
🔐 CORS:        Enabled for multiple origins
💳 Stripe:      ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured'}
✅ Status:      Ready
  `);
});

export default app;