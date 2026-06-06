import { body } from 'express-validator';

export const updateUserRoleValidation = [
  body('role')
    .isIn(['donor', 'hospital', 'admin'])
    .withMessage('Role must be donor, hospital, or admin')
];
