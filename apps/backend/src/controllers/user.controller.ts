import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess } from '../utils/api-response';

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  listManagers = async (_req: Request, res: Response) => {
    const managers = await this.userService.listManagers();

    return sendSuccess(res, 200, 'Managers retrieved successfully', managers);
  };
}
