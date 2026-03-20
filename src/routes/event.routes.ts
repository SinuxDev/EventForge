import { Router } from 'express';
import { eventController } from '../controllers/event.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { eventValidation } from '../validations/event.validation';

const router = Router();

router.use(authenticate, requireRole('organizer', 'admin'));

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
