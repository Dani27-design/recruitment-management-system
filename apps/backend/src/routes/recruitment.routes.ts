import { Router } from 'express';
import { USER_ROLES } from '../constants/roles';
import { RecruitmentController } from '../controllers/recruitment.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { recruitmentCreateSchema, recruitmentIdParamSchema } from '../validations/recruitment.validation';

const router = Router();
const recruitmentController = new RecruitmentController();

router.use(authenticate);
router.use(authorize(USER_ROLES.ADMINISTRATOR));

router.get('/', asyncHandler(recruitmentController.list));
router.get('/:id', validateRequest(recruitmentIdParamSchema), asyncHandler(recruitmentController.getById));
router.post('/', validateRequest(recruitmentCreateSchema), asyncHandler(recruitmentController.create));

export { router as recruitmentRoutes };
