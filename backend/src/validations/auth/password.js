const Joi = require('joi');

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'string.empty': 'Current password is required',
            'any.required': 'Current password is required'
        }),
    newPassword: Joi.string()
        .required()
        .min(6)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .messages({
            'string.empty': 'New password is required',
            'string.min': 'New password must be at least 6 characters long',
            'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'New password is required'
        }),
    confirmNewPassword: Joi.string()
        .required()
        .valid(Joi.ref('newPassword'))
        .messages({
            'string.empty': 'Confirm new password is required',
            'any.only': 'New passwords do not match',
            'any.required': 'Confirm new password is required'
        })
});

const resetPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        })
});

const verifyResetTokenSchema = Joi.object({
    token: Joi.string()
        .required()
        .messages({
            'string.empty': 'Reset token is required',
            'any.required': 'Reset token is required'
        }),
    newPassword: Joi.string()
        .required()
        .min(6)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .messages({
            'string.empty': 'New password is required',
            'string.min': 'New password must be at least 6 characters long',
            'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'New password is required'
        }),
    confirmNewPassword: Joi.string()
        .required()
        .valid(Joi.ref('newPassword'))
        .messages({
            'string.empty': 'Confirm new password is required',
            'any.only': 'New passwords do not match',
            'any.required': 'Confirm new password is required'
        })
});

module.exports = {
    changePasswordSchema,
    resetPasswordSchema,
    verifyResetTokenSchema
}; 