import { Request, Response, NextFunction } from 'express';
import { TokenVerifier } from '../services/auth.service';
import { User, UserAttributes } from '../models';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthenticatedRequest extends Request {
    user?: User;
  }

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = TokenVerifier(token) as UserAttributes;
    if (!decoded || !decoded.id) {
        res.status(403).json({ message: 'Invalid token payload' });
        return;
    }
    const user = await User.findByPk(decoded.id);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    req.user = user; 
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};

export const requireRole = (role: 'user' | 'operator') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (req.user.role === 'operator') {
      next();
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ message: 'Access denied.' });
      return;
    }

    next();
  };
};
