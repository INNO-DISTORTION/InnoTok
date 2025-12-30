import express from 'express';
<<<<<<< HEAD

import { AuthService } from '../services/auth.service';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/error-messages';
=======
import { AuthService } from '../services/auth.service';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/error-messages';
import { z } from 'zod';
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227

const router = express.Router();
const authService = new AuthService();

<<<<<<< HEAD
// POST /internal/auth/register
router.post('/register', async (req, res) => {
  try {
    // TODO: Implement user registration logic
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: error.message 
      });
=======
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
  displayName: z.string().min(1),
  birthday: z.string(),
  bio: z.string().optional()
});

type RegisterDto = z.infer<typeof registerSchema>;

router.post('/register', async (req, res) => {
  try {
    const validatedData: RegisterDto = registerSchema.parse(req.body);
    
    const result = await authService.registerUser(validatedData);
    return res.status(201).json(result);
  } catch (error: any) {
    console.error('Register error:', error);
    if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation Error', details: error.errors });
    }
    if (error.message === 'User already exists') {
        return res.status(409).json({ error: error.message });
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
});

<<<<<<< HEAD
// POST /internal/auth/login
router.post('/login', async (req, res) => {
  try {
    // TODO: Implement login logic
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: error.message 
      });
=======
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
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
});

<<<<<<< HEAD
// POST /internal/auth/validate
router.post('/validate', async (req, res) => {
  try {
    // TODO: Implement token validation logic
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: error.message 
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
});

// POST /internal/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    // TODO: Implement token refresh logic
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: error.message 
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
});

// POST /internal/auth/logout
router.post('/logout', async (req, res) => {
  try {
    // TODO: Implement logout logic
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: error.message 
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
});

// GET /internal/auth/oauth/initiate
router.get('/oauth/initiate', async (req, res) => {
  try {
    // TODO: Implement OAuth initiation logic
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: error.message 
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
});

// POST /internal/auth/oauth/exchange-code
router.post('/oauth/exchange-code', async (req, res) => {
  try {
    // TODO: Implement OAuth code exchange logic
    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: error.message 
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
    });
  }
});

export default router;
=======
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
>>>>>>> d2fe01e01f7beb54a8417a4612a3f926d0251227
