const express = require('express')
const router = express.Router();
const controller = require('../controllers/brand.controller')
const {validateBrand} = require('../validations/brand')
const { authenticateToken,isAdmin } = require('../middlewares/authentication');

router.get('/', controller.getBrands);
router.post('/', authenticateToken, isAdmin, validateBrand, controller.createBrand);
router.put('/:id', authenticateToken, isAdmin, controller.updateBrand );
router.delete('/:id', authenticateToken, isAdmin, controller.deleteBrand);

module.exports = router