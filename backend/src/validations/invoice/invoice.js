const Joi = require('joi');

const createInvoiceSchema = Joi.object({
    orderId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Order ID must be a valid UUID',
            'any.required': 'Order ID is required'
        }),
    paymentMethod: Joi.string()
        .required()
        .valid('credit_card', 'debit_card', 'paypal', 'bank_transfer')
        .messages({
            'string.empty': 'Payment method is required',
            'any.only': 'Payment method must be one of: credit_card, debit_card, paypal, bank_transfer',
            'any.required': 'Payment method is required'
        }),
    paymentDetails: Joi.object({
        cardNumber: Joi.string()
            .when('paymentMethod', {
                is: Joi.string().valid('credit_card', 'debit_card'),
                then: Joi.string()
                    .pattern(/^[0-9]{16}$/)
                    .required()
                    .messages({
                        'string.pattern.base': 'Card number must be 16 digits',
                        'any.required': 'Card number is required for card payments'
                    })
            }),
        expiryDate: Joi.string()
            .when('paymentMethod', {
                is: Joi.string().valid('credit_card', 'debit_card'),
                then: Joi.string()
                    .pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)
                    .required()
                    .messages({
                        'string.pattern.base': 'Expiry date must be in MM/YY format',
                        'any.required': 'Expiry date is required for card payments'
                    })
            }),
        cvv: Joi.string()
            .when('paymentMethod', {
                is: Joi.string().valid('credit_card', 'debit_card'),
                then: Joi.string()
                    .pattern(/^[0-9]{3,4}$/)
                    .required()
                    .messages({
                        'string.pattern.base': 'CVV must be 3 or 4 digits',
                        'any.required': 'CVV is required for card payments'
                    })
            }),
        paypalEmail: Joi.string()
            .when('paymentMethod', {
                is: 'paypal',
                then: Joi.string()
                    .email()
                    .required()
                    .messages({
                        'string.email': 'Please provide a valid PayPal email',
                        'any.required': 'PayPal email is required for PayPal payments'
                    })
            }),
        bankAccount: Joi.object()
            .when('paymentMethod', {
                is: 'bank_transfer',
                then: Joi.object({
                    accountNumber: Joi.string()
                        .required()
                        .messages({
                            'string.empty': 'Bank account number is required',
                            'any.required': 'Bank account number is required for bank transfers'
                        }),
                    routingNumber: Joi.string()
                        .required()
                        .messages({
                            'string.empty': 'Routing number is required',
                            'any.required': 'Routing number is required for bank transfers'
                        }),
                    accountType: Joi.string()
                        .valid('checking', 'savings')
                        .required()
                        .messages({
                            'string.empty': 'Account type is required',
                            'any.only': 'Account type must be either checking or savings',
                            'any.required': 'Account type is required for bank transfers'
                        })
                }).required()
            })
    }).required(),
    notes: Joi.string()
        .max(500)
        .allow('')
        .messages({
            'string.max': 'Notes cannot exceed 500 characters'
        })
});

const updateInvoiceStatusSchema = Joi.object({
    status: Joi.string()
        .required()
        .valid('pending', 'paid', 'failed', 'refunded')
        .messages({
            'string.empty': 'Status is required',
            'any.only': 'Status must be one of: pending, paid, failed, refunded',
            'any.required': 'Status is required'
        })
});

const invoiceIdSchema = Joi.object({
    invoiceId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Invoice ID must be a valid UUID',
            'any.required': 'Invoice ID is required'
        })
});

const invoiceQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be at least 1'
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit cannot exceed 100'
        }),
    orderId: Joi.string()
        .uuid()
        .messages({
            'string.guid': 'Order ID must be a valid UUID'
        }),
    status: Joi.string()
        .valid('pending', 'paid', 'failed', 'refunded')
        .messages({
            'any.only': 'Status must be one of: pending, paid, failed, refunded'
        }),
    paymentMethod: Joi.string()
        .valid('credit_card', 'debit_card', 'paypal', 'bank_transfer')
        .messages({
            'any.only': 'Payment method must be one of: credit_card, debit_card, paypal, bank_transfer'
        }),
    startDate: Joi.date()
        .messages({
            'date.base': 'Start date must be a valid date'
        }),
    endDate: Joi.date()
        .messages({
            'date.base': 'End date must be a valid date'
        }),
    sortBy: Joi.string()
        .valid('createdAt', 'updatedAt', 'amount')
        .default('createdAt')
        .messages({
            'string.base': 'Sort field must be a string',
            'any.only': 'Sort field must be one of: createdAt, updatedAt, amount'
        }),
    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .default('desc')
        .messages({
            'string.base': 'Sort order must be a string',
            'any.only': 'Sort order must be either asc or desc'
        })
});

module.exports = {
    createInvoiceSchema,
    updateInvoiceStatusSchema,
    invoiceIdSchema,
    invoiceQuerySchema
}; 