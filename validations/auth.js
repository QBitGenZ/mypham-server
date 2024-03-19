const Joi = require('joi');

const registerValidator = (data) => {
  const rule = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
    fullname: Joi.string().min(6).max(255).required(),
    birthday: Joi.date(),
    address: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  });

  return rule.validate(data);
}

module.exports = registerValidator;