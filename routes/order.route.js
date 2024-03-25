const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const { authenticateToken } = require('../middlewares/authentication');

router.get('/', authenticateToken, controller.getAllOrders);
router.get('/:id', authenticateToken, controller.getOrderById);

router.post('/', authenticateToken, controller.createOrder);

router.delete('/:id', authenticateToken, controller.deleteOrderById);

module.exports = router;
