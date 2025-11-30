import { Router } from 'express';

import { salesController } from '@/controllers/sales.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

// All sales routes require authentication
router.use(authMiddleware);

router.get('/summary', salesController.getSummary);
router.get('/charts', salesController.getCharts);

export { router as salesRoutes };
