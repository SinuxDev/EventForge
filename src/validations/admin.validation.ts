import { body, param, query } from 'express-validator';

export const adminValidation = {
  listUsers: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('q').optional().trim().isLength({ min: 1, max: 120 }),
    query('role').optional().isIn(['attendee', 'organizer', 'admin']),
    query('isSuspended').optional().isIn(['true', 'false']),
  ],

  updateRole: [
    param('id').isMongoId().withMessage('Invalid user id'),
    body('role')
      .notEmpty()
      .withMessage('Role is required')
      .isIn(['attendee', 'organizer', 'admin'])
      .withMessage('Role is invalid'),
    body('reason')
      .trim()
      .isLength({ min: 3, max: 300 })
      .withMessage('Reason must be between 3 and 300 characters'),
  ],

  updateSuspension: [
    param('id').isMongoId().withMessage('Invalid user id'),
    body('isSuspended').isBoolean().withMessage('isSuspended must be boolean'),
    body('reason')
      .trim()
      .isLength({ min: 3, max: 300 })
      .withMessage('Reason must be between 3 and 300 characters'),
  ],

  listAuditLogs: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('action')
      .optional()
      .isIn([
        'user.role.updated',
        'user.suspension.updated',
        'compliance.case.created',
        'compliance.case.status.updated',
        'admin.email.campaign.sent',
        'demo.request.assigned',
        'demo.request.status.updated',
        'demo.request.followup.updated',
        'demo.request.reply.sent',
      ]),
    query('targetUserId').optional().isMongoId(),
    query('actorUserId').optional().isMongoId(),
  ],
};
