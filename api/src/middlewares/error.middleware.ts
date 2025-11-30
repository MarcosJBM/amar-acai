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

  // Handle custom HTTP errors
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'Resource already exists' });
      return;
    }

    // Record not found
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Resource not found' });
      return;
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ message: 'Invalid data provided' });
    return;
  }

  // Default error response
  res.status(500).json({ message: 'Internal server error' });
}
