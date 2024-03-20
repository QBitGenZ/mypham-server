const Joi = require('joi');

exports.validateCartItem = (req, res, next) => {
  const schema = Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
