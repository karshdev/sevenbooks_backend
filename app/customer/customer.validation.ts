import { body } from 'express-validator';

export const createCustomer = [
  body('type')
    .isIn(['regular', 'business'])
    .withMessage('Type must be either regular or business'),
    
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
    
  body('companyName') 
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
    
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
    
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Invalid phone number format'),
    
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
    
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
    
  body('postalCode')  // Changed from zipCode to match interface
    .trim()
    .notEmpty()
    .withMessage('Postal code is required')
    .matches(/^[0-9]{5}(-[0-9]{4})?$/)
    .withMessage('Invalid postal code format'),
    
  body('provinceState')  // Changed from state to match interface
    .trim()
    .notEmpty()
    .withMessage('Province/State is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Province/State must be between 2 and 50 characters'),
    
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
    
];