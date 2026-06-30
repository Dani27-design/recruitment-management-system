import type { User } from '@prisma/client';
import { UnauthorizedError } from '../utils/app-error';
import { signAccessToken } from '../utils/jwt';
import { verifyPassword } from '../utils/password';
import { UserRepository } from '../repositories/user.repository';
import type { LoginInput } from '../validations/auth.validation';

export interface AuthUserDto {
  id: string;
  email: string;
  role: User['role'];
}

export interface LoginResult {
  accessToken: string;
  user: AuthUserDto;
}

export class AuthService {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly passwordVerifier = verifyPassword,
    private readonly tokenSigner = signAccessToken,
  ) {}

  async login(input: LoginInput): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await this.passwordVerifier(input.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const userDto = this.toAuthUserDto(user);

    return {
      accessToken: this.tokenSigner(userDto),
      user: userDto,
    };
  }

  private toAuthUserDto(user: User): AuthUserDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
