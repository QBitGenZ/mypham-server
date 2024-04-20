const route = require('express').Router();
const controller = require('../controllers/product.controller');
const multer = require('multer');
const {authenticateToken, isAdmin} = require('../middlewares/authentication');
const upload = multer({ dest: 'uploads/' })

route.get('', controller.getProducts);
route.get('/search', controller.searchProducts);

route.get('/video/:id', controller.streamVideo);

route.get('/brands/:id', controller.getProductByBrand),

route.post('', authenticateToken, isAdmin, upload.array('images'), upload.single('video'),
  controller.createProduct);

route.put('/:id', authenticateToken, isAdmin, upload.array('images'), upload.single('video'),
  controller.updateProduct);

route.delete('/:id',authenticateToken, isAdmin, controller.deleteProduct);

route.get('/:id', authenticateToken, controller.getProduct)



module.exports = route;