const Joi = require('joi');

const productTypeValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

module.exports = productTypeValidationSchema;
