// validations/dishValidation.js
const Joi = require('joi');

const dishValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'A dish must have a name',
      'any.required': 'A dish must have a name'
    }),
  description: Joi.string()
    .required()
    .messages({
      'string.empty': 'A dish must have a description',
      'any.required': 'A dish must have a description'
    }),
  price: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'A dish must have a price'
    }),
  inventory: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.base': 'Inventory must be a number',
      'number.min': 'Inventory cannot be negative',
      'any.required': 'A dish must have an inventory count'
    }),
  imageCover: Joi.string().optional(),
  images: Joi.array()
    .items(Joi.string())
    .optional()
});

module.exports = dishValidationSchema;
