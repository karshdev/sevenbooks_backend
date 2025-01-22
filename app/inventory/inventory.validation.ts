import { body } from 'express-validator';

export const createChartOfAccounts = [
  body('accountName')
    .notEmpty()
    .withMessage('Account name is required'),

  body('accountType')
    .notEmpty()
    .withMessage('Account type is required')
    .isString()
    .withMessage('Account type must be a string')
    .trim(),

  body('detailType')
    .notEmpty()
    .withMessage('Detail type is required')
    .isString()
    .withMessage('Detail type must be a string')
    .trim(),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Description must be between 3 and 500 characters'),

];