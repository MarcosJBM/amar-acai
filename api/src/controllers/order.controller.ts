import type { NextFunction, Request, Response } from 'express';

import { orderService } from '@/services/order.service';

export class OrderController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const { amount, weight } = req.body;
      const order = await orderService.createOrder(userId, amount, weight);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { amount, weight } = req.body;
      const order = await orderService.updateOrder(id, userId, {
        amount,
        weight,
      });
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      await orderService.deleteOrder(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const page = parseInt(req.query.page as string) || 1;
      const result = await orderService.getOrders(userId, page);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
