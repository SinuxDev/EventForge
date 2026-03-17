import { Router } from 'express';
import uploadRoutes from './upload.routes';
import authRoutes from './auth.routes';

const router = Router();

const API_VERSION = process.env.API_VERSION || 'v1';

router.use(`/${API_VERSION}/upload`, uploadRoutes);
router.use(`/${API_VERSION}/auth`, authRoutes);

export default router;
