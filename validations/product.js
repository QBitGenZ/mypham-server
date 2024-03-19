const Joi = require('joi');

const productValidationSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().optional(),
  origin: Joi.string().required(),
  volume: Joi.string().optional(),
  weight: Joi.string().optional(),
  utility: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
  cost: Joi.number().optional(),
  quantity: Joi.number().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  productionDate: Joi.date().optional(),
  expiryDate: Joi.date().optional(),
  feedbacks: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
});

const validateProduct = (productData) => {
  return productValidationSchema.validate(productData);
};

module.exports = validateProduct;
