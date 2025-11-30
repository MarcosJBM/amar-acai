import { userRepository } from '@/repositories/user.repository';
import { hashPassword } from '@/utils/hash.util';
import { HttpError } from '@/utils/http-error';

export class UserService {
  async createUser(
    username: string,
    password: string,
  ): Promise<{ id: string; username: string; createdAt: Date }> {
    const existingUser = await userRepository.findByUsername(username);

    if (existingUser) {
      throw new HttpError(409, 'Username already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.createUser(username, hashedPassword);

    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}

export const userService = new UserService();
