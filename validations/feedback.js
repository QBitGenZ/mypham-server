const Joi = require('joi');

// Định nghĩa schema validation cho Feedback
const feedbackValidationSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string(),
  numberStart: Joi.number().integer().min(1).max(5),
  images: Joi.array().items(Joi.string()).optional(), // Mảng các đường dẫn hình ảnh
  product: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // ID của sản phẩm
});

const feedbackValidate = (feedbackData) => {
  return feedbackValidationSchema.validate(feedbackData);
}

module.exports = feedbackValidate;
