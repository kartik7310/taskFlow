import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: { userId: string };
}

import logger from '../config/logger.js';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    logger.debug('No access token found in cookies');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyAccessToken(token) as { userId: string };
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('JWT verification failed', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
