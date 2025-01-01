
import { body } from 'express-validator';
export const createTransactionValidation = [
    body('accountId')
      .notEmpty()
      .withMessage('Account ID is required')
      .isMongoId()
      .withMessage('Invalid account ID format'),
    
    body('payee')
      .notEmpty()
      .withMessage('Payee is required')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Payee name must be between 2 and 100 characters'),
    
    body('account')
      .notEmpty()
      .withMessage('Account type is required')
      .isIn(['checking', 'cash', 'credit_card', 'loan'])
      .withMessage('Invalid account type'),
    
    body(['payment', 'deposit'])
      .custom((value, { req }) => {
        if (req.body.payment > 0 && req.body.deposit > 0) {
          throw new Error('Cannot have both payment and deposit');
        }
        if (req.body.payment <= 0 && req.body.deposit <= 0) {
          throw new Error('Must provide either payment or deposit');
        }
        return true;
      })
  ];
  