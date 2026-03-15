import { Router } from 'express';
import { upload } from '../config/storage.config';
import { uploadController } from '../controllers/upload.controller';

const router = Router();

router.post('/single', upload.single('file'), uploadController.uploadSingle);

router.post('/multiple', upload.array('files', 10), uploadController.uploadMultiple);

router.delete('/delete', uploadController.deleteFile);

router.get('/metadata', uploadController.getFileMetadata);

export default router;
