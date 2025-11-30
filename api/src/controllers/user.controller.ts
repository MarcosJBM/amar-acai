import type { NextFunction, Request, Response } from 'express';

import { userService } from '@/services/user.service';

export class UserController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      const user = await userService.createUser(username, password);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
