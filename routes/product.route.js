const route = require('express').Router();
const controller = require('../controllers/product.controller');
const multer = require('multer');
const {authenticateToken, isAdmin} = require('../middlewares/authentication');
const upload = multer({ dest: 'uploads/' })

route.get('', controller.getProducts);
route.get('/brands/:id', controller.getProductByBrand),

route.post('', authenticateToken, isAdmin, upload.array('images'),
  controller.createProduct);

route.put('/:id', authenticateToken, isAdmin, upload.array('images'),
  controller.updateProduct);

route.delete('/:id',authenticateToken, isAdmin, controller.deleteProduct);

route.get('/:id', authenticateToken, controller.getProduct)

module.exports = route;