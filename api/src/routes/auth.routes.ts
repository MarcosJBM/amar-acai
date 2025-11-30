import { Router } from 'express';

import { authController } from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validate.middleware';
import { loginSchema } from '@/validators/auth.validator';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);

export { router as authRoutes };
