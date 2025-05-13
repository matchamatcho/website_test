import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
// JWTの秘密鍵を環境変数から取得
const JWT_SECRET = process.env.JWT_SECRET;


// JWTを発行する関数
export const generateToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
};

// JWTを検証する関数
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('Token verification failed:', err);
    throw new Error('認証エラー');
  }
};
// auth.mjs
