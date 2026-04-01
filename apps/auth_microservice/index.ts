import './config/env'; 
import express, { RequestHandler } from 'express'; 
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dbConnection from './config/db';
import createAuthController from './controllers/auth.controller';
import { env } from './config/env';
import { RabbitMQService } from './services/rabbitmq.service';
import { UserQueueService } from './services/user.queue.service';
import { AuthService } from './services/auth.service';

// Dependency injection: provide QueueService, use RabbitMQService as implementation
const queueService = new RabbitMQService();
const userQueueService = new UserQueueService(queueService);
const authService = new AuthService(userQueueService);
const authController = createAuthController(authService);

const app = express();
// Rate Limiter Configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),// Time window 15 minutes
  limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),// Maximum 100 requests from one IP
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
// Bypass rate limiting for internal requests from other microservices
  skip: (req) => req.path.startsWith('/internal/'),
}) as unknown as RequestHandler;

app
  .use(cors())
  .use(express.json())
  .use(limiter);

dbConnection();

queueService.connect().catch((err: Error) => {
  console.error('Failed to connect to RabbitMQ on startup:', err);
});

app
  .get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Auth Microservice' });
  })
  .use('/internal/auth', authController)
  .use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  })
  .use('*', (req, res) => {
    console.log(`404 Hit: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Route not found' });
  })
  .listen(env.PORT, () => {
    console.log(`Auth service running on port ${env.PORT}`);
  });