import { Router } from 'express';

import { userController } from '@/controllers/user.controller';
import { validate } from '@/middlewares/validate.middleware';
import { createUserSchema } from '@/validators/user.validator';

const router = Router();

router.post('/', validate(createUserSchema), userController.create);

export { router as userRoutes };
