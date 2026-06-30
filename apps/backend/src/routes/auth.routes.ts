import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { loginSchema } from '../validations/auth.validation';

const router = Router();
const authController = new AuthController();

router.post('/login', validateRequest(loginSchema), asyncHandler(authController.login));
router.post('/logout', authenticate, asyncHandler(authController.logout));

export { router as authRoutes };
