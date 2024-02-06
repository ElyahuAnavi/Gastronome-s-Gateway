// validations/orderValidation.js
const Joi = require('joi');

const orderValidationSchema = Joi.object({
  user: Joi.string().required().messages({
    'string.empty': 'Order must belong to a user',
    'any.required': 'Order must belong to a user'
  }),
  dishes: Joi.array().items(Joi.object({
    dish: Joi.string().required().messages({
      'string.empty': 'Dish ID must not be empty',
      'any.required': 'Each order item must contain a dish ID'
    }),
    quantity: Joi.number().min(1).default(1).messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity must be at least 1'
    })
  })).min(1).required().messages({
    'array.min': 'Order must contain at least one dish',
    'any.required': 'Order must include dishes'
  }),
  orderScheduled: Joi.date().optional(),
  location: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    address: Joi.string().required()
  }).when('isSelfCollection', { is: false, then: Joi.required() }),
  isSelfCollection: Joi.boolean().default(false),
  totalPrice: Joi.number().min(0).optional(), 
  isItDone: Joi.boolean().default(false)
}).unknown(true); // Allow other fields to ensure compatibility with Mongoose's additional fields like timestamps

module.exports = orderValidationSchema;
