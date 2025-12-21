import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { RedisAuthRepository } from '../repositories/redis.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshTokenId, verifyAccessToken } from '../utils/jwt';

// Время жизни refresh токена для blacklist (7 дней)
const REFRESH_TTL = 7 * 24 * 60 * 60; 

export class AuthService {
  private redisRepository: RedisAuthRepository;

  constructor() {
    this.redisRepository = new RedisAuthRepository();
  }
  
  async registerUser(signUpDto: {
    email: string;
    password: string;
    username: string;
    displayName: string;
    birthday: string;
    bio?: string;
  }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const checkUser = await client.query(
        'SELECT id FROM users JOIN accounts ON users.id = accounts.user_id WHERE accounts.email = $1',
        [signUpDto.email]
      );

      if (checkUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      const userId = uuidv4();
      await client.query(
        `INSERT INTO users (id, role, disabled, created_by, updated_at) 
         VALUES ($1, 'User', false, $1, NOW())`,
        [userId]
      );

      const hashedPassword = await hashPassword(signUpDto.password);
      const accountId = uuidv4();
      await client.query(
        `INSERT INTO accounts (id, user_id, email, password_hash, provider, created_by, updated_at)
         VALUES ($1, $2, $3, $4, 'local', $2, NOW())`,
        [accountId, userId, signUpDto.email, hashedPassword]
      );

      const profileId = uuidv4();
      await client.query(
        `INSERT INTO profiles (id, user_id, username, display_name, birthday, bio, created_by, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $2, NOW())`,
        [profileId, userId, signUpDto.username, signUpDto.displayName, signUpDto.birthday, signUpDto.bio || null]
      );

      await client.query('COMMIT');

      return await this.generateNewTokens(userId, 'User', signUpDto.email);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async authenticateUser(credentials: { email: string; password: string }) {
    const result = await pool.query(
      `SELECT a.password_hash, a.user_id, u.role 
       FROM accounts a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.email = $1 AND a.provider = 'local'`,
      [credentials.email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const { password_hash, user_id, role } = result.rows[0];

    const isPasswordValid = await comparePassword(credentials.password, password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    await pool.query('UPDATE accounts SET last_login_at = NOW() WHERE email = $1', [credentials.email]);

    return await this.generateNewTokens(user_id, role, credentials.email);
  }

  async validateToken(accessToken: string) {
    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      throw new Error('Invalid access token');
    }

    const isBlacklisted = await this.redisRepository.isTokenBlacklisted(payload.jti, 'access');
    if (isBlacklisted) {
      throw new Error('Token is blacklisted');
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      isValid: true
    };
  }

  async processRefreshToken(oldRefreshTokenId: string) {
    const sessionData = await this.redisRepository.findSessionByTokenId(oldRefreshTokenId);
    
    if (!sessionData) {
      throw new Error('Invalid or expired refresh token');
    }

    const isBlacklisted = await this.redisRepository.isTokenBlacklisted(oldRefreshTokenId, 'refresh');
    if (isBlacklisted) {
      throw new Error('Refresh token revoked');
    }

    const session = JSON.parse(sessionData);

    // Rotation: удаляем старый, добавляем в blacklist
    await this.redisRepository.deleteSession(oldRefreshTokenId);
    await this.redisRepository.blacklistToken(oldRefreshTokenId, 'refresh', REFRESH_TTL);

    const userRes = await pool.query('SELECT role, accounts.email FROM users JOIN accounts ON users.id = accounts.user_id WHERE users.id = $1', [session.userId]);
    if (userRes.rows.length === 0) throw new Error('User not found');
    
    const { role, email } = userRes.rows[0];

    return await this.generateNewTokens(session.userId, role, email);
  }

  async logout(refreshTokenId: string, accessToken?: string) {
    if (refreshTokenId) {
        await this.redisRepository.deleteSession(refreshTokenId);
        await this.redisRepository.blacklistToken(refreshTokenId, 'refresh', REFRESH_TTL);
    }

    if (accessToken) {
        const payload = verifyAccessToken(accessToken);
        if (payload && payload.exp) {
            const ttl = payload.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                await this.redisRepository.blacklistToken(payload.jti, 'access', ttl);
            }
        }
    }
    
    return { message: 'Logged out successfully' };
  }

  private async generateNewTokens(userId: string, userRole: string, email: string) {
    const { token: accessToken, jti } = generateAccessToken({ userId, role: userRole, email });
    const refreshTokenId = generateRefreshTokenId();

    const sessionData = JSON.stringify({
      userId,
      ipAddress: '::1', 
      userAgent: 'unknown',
      createdAt: new Date().toISOString(),
    });

    await this.redisRepository.storeRefreshTokenId(refreshTokenId, sessionData);

    return {
      accessToken,
      refreshTokenId, 
      user: { id: userId, email, role: userRole }
    };
  }
}