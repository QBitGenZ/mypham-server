const Joi = require('joi');

const registerValidator = (data) => {
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  const rule = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
    fullname: Joi.string().min(6).max(255).required(),
    birthday: Joi.date().max(eighteenYearsAgo).required()
      .messages({
        'date.base': 'Ngày sinh phải là một ngày hợp lệ.',
        'date.max': 'Bạn phải ít nhất 18 tuổi để đăng ký.'
      }),
    address: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    gender: Joi.string().valid('Male', 'Female'),
  });

  return rule.validate(data, { abortEarly: false });
}

module.exports = registerValidator;
