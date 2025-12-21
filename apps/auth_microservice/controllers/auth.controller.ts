import express from 'express';
import { AuthService } from '../services/auth.service';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/error-messages';
import { z } from 'zod';

const router = express.Router();
const authService = new AuthService();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
  displayName: z.string().min(1),
  birthday: z.string(),
  bio: z.string().optional()
});

router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.registerUser(validatedData);
    return res.status(201).json(result);
  } catch (error: any) {
    console.error('Register error:', error);
    if (error instanceof z.ZodError) {
        // Fix: У ZodError есть свойство errors
        return res.status(400).json({ error: 'Validation Error', details: error.errors });
    }
    if (error.message === 'User already exists') {
        return res.status(409).json({ error: error.message });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    const result = await authService.authenticateUser({ email, password });
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ error: 'Access token required' });

    const result = await authService.validateToken(accessToken);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error: any) {
    return res.status(401).json({ error: error.message || 'Invalid token' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshTokenId } = req.body;
    if (!refreshTokenId) return res.status(400).json({ error: 'Refresh token ID required' });

    const result = await authService.processRefreshToken(refreshTokenId);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error: any) {
    return res.status(401).json({ error: error.message || 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { refreshTokenId, accessToken } = req.body;
    await authService.logout(refreshTokenId, accessToken);
    return res.status(HTTP_STATUS.OK).json({ message: 'Logged out' });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Logout failed' });
  }
});

export default router;