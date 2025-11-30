import { z } from 'zod';

export const createOrderSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  weight: z.number().positive('Weight must be a positive number'),
});

export const updateOrderSchema = z.object({
  amount: z.number().positive('Amount must be a positive number').optional(),
  weight: z.number().positive('Weight must be a positive number').optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
