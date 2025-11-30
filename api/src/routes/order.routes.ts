import { Router } from 'express';

import { orderController } from '@/controllers/order.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import {
  createOrderSchema,
  updateOrderSchema,
} from '@/validators/order.validator';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(createOrderSchema), orderController.create);
router.put('/:id', validate(updateOrderSchema), orderController.update);
router.delete('/:id', orderController.delete);
router.get('/', orderController.list);

export { router as orderRoutes };
