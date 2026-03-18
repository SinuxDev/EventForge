import { Router } from 'express';
import uploadRoutes from './upload.routes';
import authRoutes from './auth.routes';
import demoRequestRoutes from './demo-request.routes';
import adminRoutes from './admin.routes';

const router = Router();

const API_VERSION = process.env.API_VERSION || 'v1';

router.use(`/${API_VERSION}/upload`, uploadRoutes);
router.use(`/${API_VERSION}/auth`, authRoutes);
router.use(`/${API_VERSION}/demo-requests`, demoRequestRoutes);
router.use(`/${API_VERSION}/admin`, adminRoutes);

export default router;
