const Joi = require('joi')

exports.validateBrand = (req, res, next) => {
  const schema = Joi.object(
    {
      name: Joi.string().required(),
      text: Joi.string().optional(),
    }
  );

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};