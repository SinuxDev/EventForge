import { Router } from 'express';
import uploadRoutes from './upload.routes';

const router = Router();

const API_VERSION = process.env.API_VERSION || 'v1';

router.use(`/${API_VERSION}/upload`, uploadRoutes);

export default router;
