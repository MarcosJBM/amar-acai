import type { NextFunction, Request, Response } from 'express';

import { verifyToken } from '@/utils/jwt.util';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: 'Authorization header missing' });
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        message: 'Invalid authorization header format. Use: Bearer <token>',
      });
      return;
    }

    const token = parts[1];
    const { userId } = verifyToken(token);

    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
