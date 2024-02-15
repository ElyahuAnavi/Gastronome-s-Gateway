// utils/validateRequest.js

// Middleware for validating request data with a Joi schema
const validateRequest = schema => (req, res, next) => {
  if (!schema) {
    throw new Error('Validation schema is undefined');
  }

  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: errorMessage });
  }
  next();
};

module.exports = validateRequest;
