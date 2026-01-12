import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authController from './controllers/auth.controller';

// переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
// подключение к монго
connectDB();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Auth Microservice' });
});

app.use('/internal/auth', authController);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use('*', (req, res) => {
    console.log(`404 Hit: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`аус воркает ${PORT}`);
});