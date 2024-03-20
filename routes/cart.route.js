const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controller');
const { authenticateToken } = require('../middlewares/authentication');
const { validateCart, validateCartItem } = require('../validations/cart');

// Lấy giỏ hàng của người dùng
router.get('/', authenticateToken, controller.getCart);

// Thêm một mặt hàng vào giỏ hàng
router.post('/', authenticateToken, validateCartItem, controller.addToCart);

// Cập nhật số lượng mặt hàng trong giỏ hàng
router.put('/:id', authenticateToken, validateCartItem, controller.updateCartItem);

// Xóa một mặt hàng khỏi giỏ hàng
router.delete('/:id', authenticateToken, controller.deleteCartItem);

module.exports = router;
