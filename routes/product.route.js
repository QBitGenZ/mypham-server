const route = require('express').Router();
const controller = require('../controllers/product.controller');
const multer = require('multer');
const {authenticateToken, isAdmin} = require('../middlewares/authentication');
const upload = multer({ dest: 'uploads/' })

route.get('', controller.getProducts);

route.get('/admin', authenticateToken, isAdmin, controller.getProductsByAdmin);

route.get('/search', controller.searchProducts);

route.get('/brands/:id', controller.getProductByBrand),

route.post('', authenticateToken, isAdmin, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]),
  controller.createProduct);

route.put('/:id', authenticateToken, isAdmin, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]),
  controller.updateProduct);

route.delete('/:id',authenticateToken, isAdmin, controller.deleteProduct);

route.get('/:id', controller.getProduct)



module.exports = route;