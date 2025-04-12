const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(50)
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 50 characters',
            'any.required': 'Name is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .required()
        .min(6)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'Password is required'
        }),
    // confirmPassword: Joi.string()
    //     .required()
    //     .valid(Joi.ref('password'))
    //     .messages({
    //         'string.empty': 'Confirm password is required',
    //         'any.only': 'Passwords do not match',
    //         'any.required': 'Confirm password is required'
    //     }),
    role: Joi.string()
        .valid('user', 'admin', 'customer')
        .default('user')
        .messages({
            'any.only': 'Role must be one of: user, admin, customer'
        }),
    phone: Joi.string()
        .length(10)
        // .pattern(/[6-9]{1}[0-9]{9}/)
        .required()
        .messages({
            "any.required": "Phone number is required.",
            "string.empty": "Phone number cannot be empty.",
            "string.length": "Phone number must be exactly 10 digits long.",
            // "string.pattern.base": "Phone number is invalid.",
        }),
});

module.exports = registerSchema; 