import { Router } from 'express';
import { USER_ROLES } from '../constants/roles';
import { RecruitmentStageController } from '../controllers/recruitment-stage.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { recruitmentStageStatusUpdateSchema } from '../validations/recruitment-stage.validation';

const router = Router();
const recruitmentStageController = new RecruitmentStageController();

router.use(authenticate);
router.use(authorize(USER_ROLES.ADMINISTRATOR));

router.patch(
  '/:id/status',
  validateRequest(recruitmentStageStatusUpdateSchema),
  asyncHandler(recruitmentStageController.updateStatus),
);

export { router as recruitmentStageRoutes };
