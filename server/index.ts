// server/index.ts
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import ordersRoutes from './routes/orders.routes';
import couponsRoutes from './routes/coupons.routes';
import usersRoutes from './routes/users.routes';
import newsletterRoutes from './routes/newsletter.routes';
import paymentsRoutes from './routes/payments.routes';

dotenv.config();

const app = express();

// CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
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
    cors: FRONTEND_URL
  });
});

// Lista rutas (debug)
app.get('/api/routes', (req, res) => {
  const routes: any[] = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push({ path: middleware.route.path, methods: Object.keys(middleware.route.methods) });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          routes.push({ path: handler.route.path, methods: Object.keys(handler.route.methods) });
        }
      });
    }
  });
  res.json({ routes });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Solo loguea info en desarrollo
if (process.env.NODE_ENV !== 'production') {
  console.log(`
╔══════════════════════════════════════════╗
║   🌟 Mi Estrella - Backend Server       ║
╚══════════════════════════════════════════╝
🌐 Frontend: ${FRONTEND_URL}
💾 Database: ${process.env.DB_NAME || 'Not configured'}
💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured'}
✅ Status: Ready
  `);
}

// Export para Vercel
export default serverless(app);
