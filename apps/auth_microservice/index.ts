import compression from 'compression';
import cors from 'cors';
<<<<<<< HEAD
import dotenv from 'dotenv';
=======
import * as dotenv from 'dotenv'; 
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

<<<<<<< HEAD
// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './controllers/auth.controller';
import { ERROR_MESSAGES, HTTP_STATUS } from './constants/error-messages';
=======
dotenv.config();

import authRoutes from './controllers/auth.controller';
import { ERROR_MESSAGES, HTTP_STATUS } from './constants/error-messages';
import './config/redis'; 
import './config/db';    
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227

const app = express();
const PORT = process.env.PORT || 3002;

<<<<<<< HEAD
// Security middleware
=======
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

<<<<<<< HEAD
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Routes
app.use('/internal/auth', authRoutes);

// Health check endpoint
=======
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
});
app.use(limiter as any);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(compression() as any);

app.use(morgan('combined'));

app.use('/internal/auth', authRoutes);

>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    status: 'OK', 
    service: 'Authentication Microservice',
    timestamp: new Date().toISOString()
  });
});

<<<<<<< HEAD
// Error handling middleware
=======
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
    error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    message: process.env.NODE_ENV === 'development' ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  });
});

<<<<<<< HEAD
// 404 handler
=======
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
app.use('*', (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND });
});

app.listen(PORT, () => {
  console.log(`Authentication Microservice running on port ${PORT}`);
<<<<<<< HEAD
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
=======
});
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
