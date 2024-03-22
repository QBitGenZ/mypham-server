const Feedback = require('../models/Feedback');
const validate = require('../validations/feedback');
const Joi = require('joi');

module.exports = {
  getFeedback: async (req, res) => {
    try{
      const id = req.params.id;

      const feedback = Feedback.findById(id);

      if(!feedback)
        return res.status(404).send({error: 'Không tìm thấy phản hồi'})

      return res.status(200).send({data: feedback});
    }
    catch(error) {
      return res.status(500).send({'error': 'Lỗi nội bộ'});
    }
  },

  createFeedback: async(req, res) => {
    try {
      const {error} = validate(req.body);

      if(error)
        return res.status(400).send({ 'error': error.details[0].message });

      const {
        title,
        text,
        numberStart,
        product,
      } = req.body;

      const images = req?.files?.map(file => file.path);
      const user = req.user._id;

      const feedback = new Feedback(
        title,
        text,
        numberStart,
        product,
        images,
        user,
      )

      const feedbackCreated = await feedback.save();
      return res.status(201).json({ 'data': feedbackCreated });
    }
    catch (error) {
      return res.status(500).send({'error': 'Lỗi nội bộ'});
    }
  },

  updateFeedback: async(req, res) => {
    try {
      const {error} = validate(req.body);

      if(error)
        return res.status(400).send({ 'error': error.details[0].message });

      const feedbackId = req.params.id;

      const feedback = await Feedback.findById(feedbackId);

      if(!feedback)
        return res.status(404).send({'error': 'Không tìm thấy phản hồi'})

      if(req.user._id !== feedback.user)
        return res.status(400).send({'error': 'Bạn không có quyền chỉnh sửa'})

      const images = body?.files?.map(file => file.path);

      feedback.title = req.body.title || feedback.title
      feedback.text = req.body.text || feedback.text
      feedback.numberStart = req.body.numberStart || feedback.numberStart;
      feedback.product = req.body.product || feedback.product;
      feedback.images = images ? [...feedback.images, ...images] : feedback.images;

      const updatedFeedback = feedback.save();

      return res.status(200).send({'data': updatedFeedback});

    }
    catch (e) {
      return res.status(500).send({'error': 'Lỗi nội bộ'})
    }
  },

  deleteFeedback: async (res, req) => {
    try {
      const feedbackId = req.params.id;

      if(req.user._id !== feedback.user)
        return res.status(400).send({'error': 'Bạn không có quyền chỉnh sửa'})

      const feedback = await Feedback.findByIdAndDelete(feedbackId);

      if(!feedback)
        return res.status(404).send({'error': 'Không tìm thấy phản hồi'})

      return res.sendStatus(204);
    }
    catch (error) {
      return res.status(500).send({'error': 'Lỗi nội bộ'})
    }

  }
}