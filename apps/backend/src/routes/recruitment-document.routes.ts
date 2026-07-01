import { Router } from 'express';
import { USER_ROLES } from '../constants/roles';
import { RecruitmentDocumentController } from '../controllers/recruitment-document.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { recruitmentDocumentIdParamSchema } from '../validations/recruitment-document.validation';

const router = Router();
const recruitmentDocumentController = new RecruitmentDocumentController();

router.use(authenticate);

router.get(
  '/:id/download',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  validateRequest(recruitmentDocumentIdParamSchema),
  asyncHandler(recruitmentDocumentController.download),
);
router.delete(
  '/:id',
  authorize(USER_ROLES.ADMINISTRATOR),
  validateRequest(recruitmentDocumentIdParamSchema),
  asyncHandler(recruitmentDocumentController.delete),
);

export { router as recruitmentDocumentRoutes };
