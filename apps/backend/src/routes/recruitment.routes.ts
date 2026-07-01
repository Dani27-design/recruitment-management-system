import { Router } from 'express';
import { USER_ROLES } from '../constants/roles';
import { RecruitmentController } from '../controllers/recruitment.controller';
import { RecruitmentDocumentController } from '../controllers/recruitment-document.controller';
import { RecruitmentStageController } from '../controllers/recruitment-stage.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { uploadDocumentFile } from '../middlewares/upload.middleware';
import { validateRequest } from '../middlewares/validate-request';
import {
  recruitmentDocumentListParamSchema,
  recruitmentDocumentUploadSchema,
} from '../validations/recruitment-document.validation';
import { recruitmentStageListParamSchema } from '../validations/recruitment-stage.validation';
import { recruitmentCreateSchema, recruitmentIdParamSchema } from '../validations/recruitment.validation';

const router = Router();
const recruitmentController = new RecruitmentController();
const recruitmentDocumentController = new RecruitmentDocumentController();
const recruitmentStageController = new RecruitmentStageController();

router.use(authenticate);

router.get(
  '/',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  asyncHandler(recruitmentController.list),
);
router.get(
  '/:id/stages',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  validateRequest(recruitmentStageListParamSchema),
  asyncHandler(recruitmentStageController.listByRecruitment),
);
router.get(
  '/:id/documents',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  validateRequest(recruitmentDocumentListParamSchema),
  asyncHandler(recruitmentDocumentController.listByRecruitment),
);
router.post(
  '/:id/documents',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  uploadDocumentFile.single('file'),
  validateRequest(recruitmentDocumentUploadSchema),
  asyncHandler(recruitmentDocumentController.upload),
);
router.get(
  '/:id',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  validateRequest(recruitmentIdParamSchema),
  asyncHandler(recruitmentController.getById),
);
router.post(
  '/',
  authorize(USER_ROLES.ADMINISTRATOR),
  validateRequest(recruitmentCreateSchema),
  asyncHandler(recruitmentController.create),
);

export { router as recruitmentRoutes };
