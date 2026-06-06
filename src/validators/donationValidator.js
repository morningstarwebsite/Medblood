import { body, query } from 'express-validator';

const bloodGroupValidator = body('bloodGroup')
  .isIn(['A', 'B', 'AB', 'O'])
  .withMessage('bloodGroup must be A, B, AB, or O');

const rhesusFactorValidator = body('rhesusFactor')
  .isIn(['+', '-'])
  .withMessage('rhesusFactor must be + or -');

export const createDonationValidation = [
  bloodGroupValidator,
  rhesusFactorValidator,
  body('donorId').optional().isUUID().withMessage('donorId must be a valid UUID'),
  body('quantityInBags')
    .isInt({ min: 1 })
    .withMessage('quantityInBags must be an integer of at least 1'),
  body('location').trim().notEmpty().withMessage('location is required'),
  body('healthStatus').trim().notEmpty().withMessage('healthStatus is required'),
  body('lastTestDate')
    .isISO8601()
    .withMessage('lastTestDate must be a valid date in YYYY-MM-DD format'),
  body('availabilityStatus')
    .optional()
    .isIn(['available', 'reserved', 'used', 'unavailable'])
    .withMessage('availabilityStatus is invalid')
];

export const updateDonationValidation = [
  body('bloodGroup')
    .optional()
    .isIn(['A', 'B', 'AB', 'O'])
    .withMessage('bloodGroup must be A, B, AB, or O'),
  body('rhesusFactor')
    .optional()
    .isIn(['+', '-'])
    .withMessage('rhesusFactor must be + or -'),
  body('quantityInBags')
    .optional()
    .isInt({ min: 1 })
    .withMessage('quantityInBags must be an integer of at least 1'),
  body('location').optional().trim().notEmpty().withMessage('location cannot be empty'),
  body('healthStatus')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('healthStatus cannot be empty'),
  body('lastTestDate')
    .optional()
    .isISO8601()
    .withMessage('lastTestDate must be a valid date in YYYY-MM-DD format'),
  body('availabilityStatus')
    .optional()
    .isIn(['available', 'reserved', 'used', 'unavailable'])
    .withMessage('availabilityStatus is invalid')
];

export const donationListValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),
  query('bloodGroup')
    .optional()
    .isIn(['A', 'B', 'AB', 'O'])
    .withMessage('bloodGroup must be A, B, AB, or O'),
  query('rhesusFactor')
    .optional()
    .isIn(['+', '-'])
    .withMessage('rhesusFactor must be + or -'),
  query('location').optional().isString().withMessage('location must be a string')
];

export const compatibilityValidation = [
  query('bloodGroup')
    .notEmpty()
    .isIn(['A', 'B', 'AB', 'O'])
    .withMessage('bloodGroup must be A, B, AB, or O'),
  query('rhesusFactor')
    .notEmpty()
    .isIn(['+', '-'])
    .withMessage('rhesusFactor must be + or -')
];
