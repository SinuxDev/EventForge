import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { authValidation } from '../validations/auth.validation';

const router = Router();

router.post('/register', validateRequest(authValidation.register), authController.register);
router.post('/login', validateRequest(authValidation.login), authController.login);
router.post('/social', validateRequest(authValidation.socialLogin), authController.socialLogin);
router.get('/me', authController.me);
router.post(
  '/upgrade-role',
  validateRequest(authValidation.upgradeRole),
  authController.upgradeRole
);

export default router;
