const Joi = require('joi');

const registerValidator = (data) => {
  const rule = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
    fullname: Joi.string().min(6).max(255).required(),
    birthday: Joi.date().max('now').iso().required().raw()
      .less('18 years')
      .messages({
        'date.base': 'Ngày sinh phải là một ngày hợp lệ.',
        'date.max': 'Ngày sinh không thể ở tương lai.',
        'date.less': 'Bạn phải ít nhất 18 tuổi để đăng ký.'
      }),
    address: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    gender: Joi.string().valid('Male', 'Female'),
  });

  return rule.validate(data);
}

module.exports = registerValidator;
