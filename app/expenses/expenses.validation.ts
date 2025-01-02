import { body } from 'express-validator';

export const createExpense = [
  // Vendor Validations
  body('vendor.name')
    .trim()
    .notEmpty()
    .withMessage('Vendor name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Vendor name must be between 2 and 100 characters'),

  body('vendor.email')
    .trim()
    .notEmpty()
    .withMessage('Vendor email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('vendor.address')
    .trim()
    .notEmpty()
    .withMessage('Vendor address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),

  body('vendor.taxId')
    .trim()
    .notEmpty()
    .withMessage('Tax ID is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Tax ID must be between 3 and 50 characters'),


    body('vendor.dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const dueDate = new Date(value);
      const today = new Date();
      
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        throw new Error('Due date must be today or a future date');
      }
      return true;
    }),

  // Expense Array Validations
  body('expenses')
    .isArray()
    .withMessage('Expense must be an array')
    .notEmpty()
    .withMessage('At least one expense is required'),

  body('expenses.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be greater than 0'),

  body('expenses.*.unitPrice')
    .notEmpty()
    .withMessage('Unit price is required')
    .isFloat({ min: 0.01 })
    .withMessage('Unit price must be greater than 0'),

  body('expenses.*.status')
    .optional()
    .isIn(['pending', 'paid', 'overdue'])
    .withMessage('Invalid status. Must be pending, paid, or overdue'),

  body('expenses.*.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('expenses').custom((value) => {
    if (!Array.isArray(value)) {
      throw new Error('Expenses must be provided as an array');
    }
    if (value.length === 0) {
      throw new Error('At least one expense is required');
    }
    for (const expense of value) {
      if (!expense.quantity || !expense.unitPrice || !expense.taxRate) {
        throw new Error('Each expense must have quantity, unitPrice, and taxRate');
      }
    }
    return true;
  })
];