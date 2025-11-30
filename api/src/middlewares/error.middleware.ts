import type { NextFunction, Request, Response } from 'express';

import { Prisma } from '@/generated/prisma';
import { HttpError } from '@/utils/http-error';

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error('Error:', error);

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'Resource already exists' });
      return;
    }

    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Resource not found' });
      return;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ message: 'Invalid data provided' });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
}
