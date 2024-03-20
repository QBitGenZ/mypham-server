const Joi = require('joi');

const productTypeValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

const validateProduct = (productData) => {
  return productTypeValidationSchema.validate(productData);
};

module.exports = validateProduct;
