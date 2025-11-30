import { userRepository } from '@/repositories/user.repository';
import { comparePassword } from '@/utils/hash.util';
import { HttpError } from '@/utils/http-error';
import { generateToken } from '@/utils/jwt.util';

export class AuthService {
  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; userId: string }> {
    const user = await userRepository.findByUsername(username);

    if (!user) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const token = generateToken(user.id);

    return {
      token,
      userId: user.id,
    };
  }
}

export const authService = new AuthService();
