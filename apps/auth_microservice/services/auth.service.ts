import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshTokenId, verifyAccessToken } from '../utils/jwt';
import { RedisAuthRepository } from '../repositories/redis.repository';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  private redisRepository: RedisAuthRepository;

  constructor() {
    this.redisRepository = new RedisAuthRepository();
  }

  
  async registerUser(data: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
    birthday?: string;
    bio?: string;
  }) {
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }
    const passwordHash = await hashPassword(data.password);
    const newUser = new User({
      email: data.email,
      username: data.username,
      passwordHash,
      displayName: data.displayName,
      birthday: data.birthday,
      bio: data.bio,
      role: 'User',
    });

    await newUser.save();
    return this.generateTokens(newUser._id.toString(), newUser.role, newUser.email, newUser.username);
  }

  async authenticateUser(credentials: { email: string; password: string }) {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new Error('Invalid credentials');
    }    const isMatch = await comparePassword(credentials.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    return this.generateTokens(user._id.toString(), user.role, user.email, user.username);
  }


  async refreshTokens(oldRefreshTokenId: string) {
    const sessionData = await this.redisRepository.findSessionByTokenId(oldRefreshTokenId);
    
    if (!sessionData) {
      throw new Error('Invalid or expired refresh token');
    }
    const { userId } = JSON.parse(sessionData);
    const user = await User.findById(userId);
    if (!user) {
      await this.redisRepository.deleteSession(oldRefreshTokenId);
      throw new Error('User not found');
    }
    await this.redisRepository.deleteSession(oldRefreshTokenId);
    return this.generateTokens(user._id.toString(), user.role, user.email, user.username);
  }

  async validateToken(accessToken: string) {
    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      console.log('[Auth Service] FAIL: verifyAccessToken returned null (Signature invalid or expired)');
      return null;
    }
    console.log('[Auth Service] JWT Payload:', JSON.stringify(payload));
    try {
        const isBlacklisted = await this.redisRepository.isTokenBlacklisted(payload.jti, 'access');
        console.log('[Auth Service] Redis Blacklist Check:', isBlacklisted);
        if (isBlacklisted) {
          console.log('[Auth Service] FAIL: Token is blacklisted');
          return null;
        }
    } catch (err) {
        console.error('[Auth Service] REDIS ERROR:', err);
        return null; 
    }
    console.log('[Auth Service] SUCCESS: Token valid.');
    return {
      isValid: true,
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  }

  async logout(refreshTokenId: string, accessToken?: string) {
    if (refreshTokenId) {
      await this.redisRepository.deleteSession(refreshTokenId);
    }
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload && payload.jti && payload.exp) {
        const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
        if (expiresIn > 0) {
          await this.redisRepository.blacklistToken(payload.jti, 'access', expiresIn);
        }
      }
    }
  }

  private async generateTokens(userId: string, role: string, email: string, username: string) {
    const { token: accessToken, jti } = generateAccessToken({ userId, role, email });
    const refreshTokenId = generateRefreshTokenId();
    await this.redisRepository.storeRefreshTokenId(refreshTokenId, JSON.stringify({ userId }));
    return {
      user: { id: userId, email, role, username }, 
      accessToken,
      refreshTokenId,
    };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[Forgot Password] User with email ${email} not found. Doing nothing.`);
      return; 
    }
    const resetToken = uuidv4();
    await this.redisRepository.setResetToken(resetToken, user._id.toString());
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}`;
    console.log(`[MOCK EMAIL SERVICE] Sending password reset link to ${email}`);
    console.log(`LINK: ${resetLink}`);
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this.redisRepository.getAndDeleteResetToken(token);
    if (!userId) {
      throw new Error('Invalid or expired reset token');
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const passwordHash = await hashPassword(newPassword);
    user.passwordHash = passwordHash;
    await user.save();
    return { message: 'Password successfully updated' };
  }
}