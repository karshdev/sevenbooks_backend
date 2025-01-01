import { body } from 'express-validator';

export const createVendorValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .toLowerCase(),

    body('address')
        .trim()
        .notEmpty()
        .withMessage('Address is required')
        .isString()
        .withMessage('Address must be a string'),

    body('taxId')
        .trim()
        .notEmpty()
        .withMessage('Tax ID is required')
        .isString()
        .withMessage('Tax ID must be a string')

];