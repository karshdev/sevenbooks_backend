import { body } from 'express-validator';
import { AccountType } from './banking.dto';

export const createAccount = [
  body('accountName')
    .trim()
    .notEmpty()
    .withMessage('Account name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Account name must be between 2 and 100 characters'),

  body('accountNumber')
    .trim()
    .notEmpty()
    .withMessage('Account number is required')
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage('Account number can only contain letters, numbers, and hyphens'),

  body('openingBalance')
    .isNumeric()
    .withMessage('Opening balance must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Opening balance cannot be negative');
      }
      return true;
    }),

  body('branchId')
    .trim()
    .notEmpty()
    .withMessage('Branch ID is required')
    .isAlphanumeric()
    .withMessage('Branch ID must contain only letters and numbers'),

  body('accountType')
    .trim()
    .notEmpty()
    .withMessage('Account type is required')
    .isIn(Object.values(AccountType))
    .withMessage('Invalid account type'),

  body('creditLimit')
    .if(body('accountType').isIn([AccountType.CREDIT_CARD, AccountType.LOAN]))
    .isNumeric()
    .withMessage('Credit limit must be a number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Credit limit must be greater than 0');
      }
      return true;
    }),

  body('interestRate')
    .if(body('accountType').isIn([AccountType.CREDIT_CARD, AccountType.LOAN]))
    .isFloat({ min: 0, max: 100 })
    .withMessage('Interest rate must be between 0 and 100'),



    body('dueDate')
    .if(body('accountType').isIn([AccountType.CREDIT_CARD, AccountType.LOAN]))
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
        const date = new Date(value);
        return true;
    }),


  body('minimumPayment')
    .if(body('accountType').isIn([AccountType.CREDIT_CARD, AccountType.LOAN]))
    .isNumeric()
    .withMessage('Minimum payment must be a number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Minimum payment must be greater than 0');
      }
      return true;
    }),

  body(['creditLimit', 'interestRate', 'dueDate', 'minimumPayment'])
    .if(body('accountType').isIn([AccountType.CHECKING, AccountType.CASH]))
    .custom((value, { path }) => {
      if (value !== undefined) {
        throw new Error(`${path} should not be provided for checking or cash accounts`);
      }
      return true;
    })
];

export const updateAccount = [
  body('accountName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Account name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Account name must be between 2 and 100 characters'),

  body('branchId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Branch ID cannot be empty')
    .isAlphanumeric()
    .withMessage('Branch ID must contain only letters and numbers'),

  body('accountNumber')
    .not()
    .exists()
    .withMessage('Account number cannot be updated'),

  body('accountType')
    .not()
    .exists()
    .withMessage('Account type cannot be updated'),

  body('creditLimit')
    .optional()
    .isNumeric()
    .withMessage('Credit limit must be a number')
    .custom((value, { req }) => {
      if (req.account?.accountType === AccountType.CHECKING || 
          req.account?.accountType === AccountType.CASH) {
        throw new Error('Cannot add credit limit to checking or cash accounts');
      }
      if (value <= 0) {
        throw new Error('Credit limit must be greater than 0');
      }
      return true;
    }),

  body('interestRate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Interest rate must be between 0 and 100')
    .custom((value, { req }) => {
      if (req.account?.accountType === AccountType.CHECKING || 
          req.account?.accountType === AccountType.CASH) {
        throw new Error('Cannot add interest rate to checking or cash accounts');
      }
      return true;
    }),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value, { req }) => {
      if (req.account?.accountType === AccountType.CHECKING || 
          req.account?.accountType === AccountType.CASH) {
        throw new Error('Cannot add due date to checking or cash accounts');
      }
      const date = new Date(value);
      if (date < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),

  body('minimumPayment')
    .optional()
    .isNumeric()
    .withMessage('Minimum payment must be a number')
    .custom((value, { req }) => {
      if (req.account?.accountType === AccountType.CHECKING || 
          req.account?.accountType === AccountType.CASH) {
        throw new Error('Cannot add minimum payment to checking or cash accounts');
      }
      if (value <= 0) {
        throw new Error('Minimum payment must be greater than 0');
      }
      return true;
    }),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];