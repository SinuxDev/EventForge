import { Router } from 'express';
import { appealRequestController } from '../controllers/appeal-request.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { appealRequestValidation } from '../validations/appeal-request.validation';

const router = Router();

router.post('/', validateRequest(appealRequestValidation.create), appealRequestController.create);

export default router;
