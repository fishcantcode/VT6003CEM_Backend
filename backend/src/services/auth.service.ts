import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserAttributes } from '../models/user.model';

export const passwordHash = async (password: string): Promise<string> => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
  return bcrypt.hash(password, saltRounds);
};
export const passwordCompare = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
export const TokenGenerator = (user: UserAttributes): string => {
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    if (!secretKey) {
        throw new Error('secret key is not defined');
    }
    return jwt.sign(
        {
        id: user.id,
        email: user.email,
        role: user.role,
        },
        secretKey,
        {
        expiresIn: process.env.JWT_EXPIRES_IN,
        } as jwt.SignOptions,
    );
};

export const TokenVerifier = (token: string): UserAttributes => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('secret key is not defined');
  }
  try {
    const decoded = jwt.verify(token, secretKey) as UserAttributes;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};