import { prisma } from '@/config/database';
import type { User } from '@/generated/prisma';

export class UserRepository {
  async createUser(username: string, hashedPassword: string): Promise<User> {
    return prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
