import { Router } from 'express';
import { USER_ROLES } from '../constants/roles';
import { DashboardController } from '../controllers/dashboard.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();
const dashboardController = new DashboardController();

router.use(authenticate);

router.get(
  '/summary',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  asyncHandler(dashboardController.summary),
);

export { router as dashboardRoutes };
