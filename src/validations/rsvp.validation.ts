import { body, param } from 'express-validator';

export const rsvpValidation = {
  submitRsvp: [
    param('id').isMongoId().withMessage('Invalid event id'),
    body('formResponses')
      .optional()
      .isArray({ max: 20 })
      .withMessage('formResponses must be an array'),
    body('formResponses.*.question')
      .optional()
      .trim()
      .isLength({ min: 1, max: 120 })
      .withMessage('Question must be 1-120 characters'),
    body('formResponses.*.answer')
      .optional()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Answer must be 1-500 characters'),
  ],

  cancelRsvp: [param('id').isMongoId().withMessage('Invalid RSVP id')],
};
