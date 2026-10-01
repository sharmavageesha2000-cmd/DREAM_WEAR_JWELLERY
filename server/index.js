import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, query } from './src/config/db.js';

// Import Routes
import productsRouter from './src/routes/products.js';
import categoriesRouter from './src/routes/categories.js';
import collectionsRouter from './src/routes/collections.js';
import authRouter from './src/routes/auth.js';
import ordersRouter from './src/routes/orders.js';
import reviewsRouter from './src/routes/reviews.js';
import couponsRouter from './src/routes/coupons.js';
import newsletterRouter from './src/routes/newsletter.js';
import shippingRouter from './src/routes/shipping.js';
import adminRouter from './src/routes/admin.js';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;


// CORS setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(null, true); // Allow during development
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl !== '/api/v1/health') {
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
const healthHandler = async (req, res) => {
  try {
    const dbTest = await query('SELECT 1 as test');
    res.json({
      status: 'healthy',
      service: 'AURELIA Fine Jewelry REST API',
      database: dbTest.rows[0].test === 1 ? 'connected' : 'error',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (err) {
    res.status(500).json({
      status: 'degraded',
      service: 'AURELIA Fine Jewelry REST API',
      database: 'disconnected',
      error: err.message,
    });
  }
};

app.get('/health', healthHandler);
app.get('/api/v1/health', healthHandler);
app.get('/api/health', healthHandler);

// Mount API v1 routes
const v1Router = express.Router();
v1Router.use('/products', productsRouter);
v1Router.use('/categories', categoriesRouter);
v1Router.use('/collections', collectionsRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/orders', ordersRouter);
v1Router.use('/reviews', reviewsRouter);
v1Router.use('/coupons', couponsRouter);
v1Router.use('/newsletter', newsletterRouter);
v1Router.use('/shipping', shippingRouter);
v1Router.use('/admin', adminRouter);

app.use('/api/v1', v1Router);
// Also alias to /api for compatibility
app.use('/api', v1Router);

// Serve static frontend assets and SPA fallback in production if dist/ exists
if (fs.existsSync(distPath)) {
  console.log(`📦 Serving frontend static build from: ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for non-API client routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback root route if frontend dist isn't built
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to AURELIA Haute Minimal Jewelry API',
      docs: '/api/v1/health',
      endpoints: [
        '/api/v1/products',
        '/api/v1/categories',
        '/api/v1/collections',
        '/api/v1/auth',
        '/api/v1/orders',
        '/api/v1/reviews',
        '/api/v1/coupons',
        '/api/v1/newsletter',
        '/api/v1/shipping',
        '/api/v1/admin/analytics',
      ],
    });
  });
}

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start Server after Database Initialization
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`✨ AURELIA Express & PostgreSQL Backend Running!`);
      console.log(`🚀 Port: ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/v1/health`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to initialize database and start server:', err);
    process.exit(1);
  }
}

startServer();
