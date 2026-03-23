import { Router } from 'express';
import { uploadEventCovers } from '../config/storage.config';
import { eventController } from '../controllers/event.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { eventValidation } from '../validations/event.validation';

const router = Router();

router.get(
  '/public',
  validateRequest(eventValidation.listPublicEvents),
  eventController.listPublicEvents
);
router.get(
  '/public/:id',
  validateRequest(eventValidation.getPublicEvent),
  eventController.getPublicEvent
);

router.use(authenticate, requireRole('organizer', 'admin'));

router.post('/upload-cover', uploadEventCovers.single('coverImage'), eventController.uploadCover);

router.post('/', validateRequest(eventValidation.createDraft), eventController.createDraft);
router.patch('/:id', validateRequest(eventValidation.updateEvent), eventController.updateEvent);
router.post(
  '/:id/publish',
  validateRequest(eventValidation.publishEvent),
  eventController.publishEvent
);
router.get('/:id', validateRequest(eventValidation.getMyEvent), eventController.getMyEvent);
router.get('/', validateRequest(eventValidation.listMyEvents), eventController.listMyEvents);

export default router;
