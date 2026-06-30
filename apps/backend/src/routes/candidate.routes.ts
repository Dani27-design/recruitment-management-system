import { Router } from 'express';
import { USER_ROLES } from '../constants/roles';
import { CandidateController } from '../controllers/candidate.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request';
import {
  candidateCreateSchema,
  candidateIdParamSchema,
  candidateListQuerySchema,
  candidateUpdateSchema,
} from '../validations/candidate.validation';

const router = Router();
const candidateController = new CandidateController();

router.use(authenticate);

router.get(
  '/',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  validateRequest(candidateListQuerySchema),
  asyncHandler(candidateController.list),
);
router.get(
  '/:id',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  validateRequest(candidateIdParamSchema),
  asyncHandler(candidateController.getById),
);
router.post(
  '/',
  authorize(USER_ROLES.ADMINISTRATOR),
  validateRequest(candidateCreateSchema),
  asyncHandler(candidateController.create),
);
router.put(
  '/:id',
  authorize(USER_ROLES.ADMINISTRATOR),
  validateRequest(candidateUpdateSchema),
  asyncHandler(candidateController.update),
);
router.delete(
  '/:id',
  authorize(USER_ROLES.ADMINISTRATOR),
  validateRequest(candidateIdParamSchema),
  asyncHandler(candidateController.delete),
);

export { router as candidateRoutes };
