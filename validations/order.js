const Joi = require('joi');

const orderItemJoiSchema = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

const orderJoiSchema = Joi.object({
  paymentMethod: Joi.string().required(),
  deliveryMethod: Joi.string().required(),
  address: Joi.string().required(),
  items: Joi.array().items(orderItemJoiSchema).required(),
  status: Joi.string().optional(),
  totalPrice: Joi.number().required(),
});

function validateOrder(order) {
  return orderJoiSchema.validate(order);
}

module.exports = validateOrder;
