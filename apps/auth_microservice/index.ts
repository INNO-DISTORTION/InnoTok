import compression from 'compression';
import cors from 'cors';
import * as dotenv from 'dotenv'; 
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

import authRoutes from './controllers/auth.controller';
import { ERROR_MESSAGES, HTTP_STATUS } from './constants/error-messages';
import './config/redis'; 
import './config/db';    

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

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

app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    status: 'OK', 
    service: 'Authentication Microservice',
    timestamp: new Date().toISOString()
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
    error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    message: process.env.NODE_ENV === 'development' ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  });
});

app.use('*', (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND });
});

app.listen(PORT, () => {
  console.log(`Authentication Microservice running on port ${PORT}`);
});