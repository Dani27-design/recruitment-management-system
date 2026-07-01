import { Router } from 'express';
import { USER_ROLES } from '../constants/roles';
import { UserController } from '../controllers/user.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();
const userController = new UserController();

router.use(authenticate);

router.get(
  '/managers',
  authorize(USER_ROLES.ADMINISTRATOR),
  asyncHandler(userController.listManagers),
);

export { router as userRoutes };
