const Joi = require('joi');

const orderItemJoiSchema = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

const orderJoiSchema = Joi.object({
  user: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  deliveryMethod: Joi.string().required(),
  address: Joi.string().required(),
  items: Joi.array().items(orderItemJoiSchema).required(),
  created_at: Joi.date().default(Date.now(), 'current date')
});

function validateOrder(order) {
  return orderJoiSchema.validate(order);
}

module.exports = validateOrder;
