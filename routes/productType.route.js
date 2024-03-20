const route = require('express').Router();
const controller = require('../controllers/productType.controller');
const {authenticateToken, isAdmin} = require('../middlewares/authentication');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

route.get('', controller.getProductTypes);
route.post('', authenticateToken, isAdmin,
  controller.createProductType);
route.put('/:id', authenticateToken, isAdmin,
  controller.updateProductType);
route.delete('/:id',authenticateToken, isAdmin, controller.deleteProductType);

module.exports = route;