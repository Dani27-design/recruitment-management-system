import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/api-response';

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);

    return sendSuccess(res, 200, 'Login successful', result);
  };

  logout = async (_req: Request, res: Response) => {
    return sendSuccess(res, 200, 'Logout successful', null);
  };
}
