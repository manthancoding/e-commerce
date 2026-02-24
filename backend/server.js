import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './src/database/db.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import { 
  generalLimiter, 
  corsOptions
} from './src/middleware/security.js';
import { 
  errorHandler, 
  notFoundHandler 
} from './src/middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize MongoDB connection
await connectDB();

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));

// Parse middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
app.use('/api/', generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

export default app;
