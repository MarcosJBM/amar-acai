import type { NextFunction, Request, Response } from 'express';

import { salesService } from '@/services/sales.service';

export class SalesController {
  async getSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.userId!;
      const summary = await salesService.getSummary(userId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  async getCharts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.userId!;
      const charts = await salesService.getCharts(userId);
      res.json(charts);
    } catch (error) {
      next(error);
    }
  }
}

export const salesController = new SalesController();
