import { Router } from 'express';
import { USER_ROLES } from '../constants/roles';
import { RecruitmentStageController } from '../controllers/recruitment-stage.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { requireStageOwnership } from '../middlewares/stage-ownership.middleware';
import { validateRequest } from '../middlewares/validate-request';
import {
  recruitmentStageAssignmentSchema,
  recruitmentStageStatusUpdateSchema,
} from '../validations/recruitment-stage.validation';

const router = Router();
const recruitmentStageController = new RecruitmentStageController();

router.use(authenticate);

router.patch(
  '/:id/status',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  validateRequest(recruitmentStageStatusUpdateSchema),
  asyncHandler(requireStageOwnership()),
  asyncHandler(recruitmentStageController.updateStatus),
);
router.patch(
  '/:id/assignment',
  authorize(USER_ROLES.ADMINISTRATOR),
  validateRequest(recruitmentStageAssignmentSchema),
  asyncHandler(recruitmentStageController.assignManager),
);

export { router as recruitmentStageRoutes };
