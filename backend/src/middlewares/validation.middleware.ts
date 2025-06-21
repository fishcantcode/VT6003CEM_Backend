import { Request, Response, NextFunction } from 'express';
import { TokenVerifier } from '../services/auth.service';
import { User } from '../models/user.model';

import { UserAttributes } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const user = TokenVerifier(token);
    req.user = user; // Attach user info to request object
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};

// Role validation middleware
export const requireRole = (role: 'user' | 'operator') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (req.user.role === 'operator'){
        return next(); // Allow operators to access everything
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied. ` });
    }
    next();
  };
};

