import { Router } from 'express';
import { USER_ROLES } from '../constants/roles';
import { AuditController } from '../controllers/audit.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { auditLogListQuerySchema } from '../validations/audit.validation';

const router = Router();
const auditController = new AuditController();

router.use(authenticate);

router.get(
  '/',
  authorize(USER_ROLES.ADMINISTRATOR),
  validateRequest(auditLogListQuerySchema),
  asyncHandler(auditController.list),
);

export { router as auditRoutes };
