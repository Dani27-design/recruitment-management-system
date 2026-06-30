import { Router } from 'express';
import { USER_ROLES } from '../constants/roles';
import { VacancyController } from '../controllers/vacancy.controller';
import { asyncHandler } from '../middlewares/async-handler';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request';
import {
  vacancyCreateSchema,
  vacancyIdParamSchema,
  vacancyUpdateSchema,
} from '../validations/vacancy.validation';

const router = Router();
const vacancyController = new VacancyController();

router.use(authenticate);

router.get('/', authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER), asyncHandler(vacancyController.list));
router.get(
  '/:id',
  authorize(USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER),
  validateRequest(vacancyIdParamSchema),
  asyncHandler(vacancyController.getById),
);
router.post(
  '/',
  authorize(USER_ROLES.ADMINISTRATOR),
  validateRequest(vacancyCreateSchema),
  asyncHandler(vacancyController.create),
);
router.put(
  '/:id',
  authorize(USER_ROLES.ADMINISTRATOR),
  validateRequest(vacancyUpdateSchema),
  asyncHandler(vacancyController.update),
);
router.delete(
  '/:id',
  authorize(USER_ROLES.ADMINISTRATOR),
  validateRequest(vacancyIdParamSchema),
  asyncHandler(vacancyController.delete),
);

export { router as vacancyRoutes };
