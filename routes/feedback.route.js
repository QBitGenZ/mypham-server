const {authenticateToken} = require('../middlewares/authentication');
const multer = require('multer');
const route = require('express').Router()
const upload = multer({ dest: 'uploads/' })
const controller = require('../controllers/feedback.controller')

route.get('/:id', authenticateToken, controller.getFeedback)
route.post('',authenticateToken,upload.array('images'), controller.createFeedback)
route.put('/:id', authenticateToken,upload.array('images'), controller.updateFeedback)
route.delete('/:id',authenticateToken, controller.deleteFeedback)

module.exports = route;