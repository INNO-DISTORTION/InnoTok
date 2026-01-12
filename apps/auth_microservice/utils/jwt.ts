import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

interface TokenPayload {
  userId: string;
  role: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
  const jti = require('crypto').randomBytes(16).toString('hex');// jti или jwt id нужен для возможности добавить токен в черный список
  
  const token = jwt.sign({ ...payload, jti }, ACCESS_SECRET, {
    expiresIn: '15m', 
  });
  
  return { token, jti };
};

export const generateRefreshTokenId = () => {
  return require('uuid').v4(); 
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as any;
  } catch (error: any) {
    console.log('[JWT Error] Verification failed for token:');
    console.log(token.substring(0, 20) + '...'); 
    console.log('Reason:', error.message); 
    console.log('Using Secret:', ACCESS_SECRET); 
    return null;
  }
};