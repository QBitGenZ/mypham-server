const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const { authenticateToken, isAdmin } = require('../middlewares/authentication');

router.get('/', authenticateToken, controller.getAllOrders);
router.get('/admin', authenticateToken, isAdmin, controller.getAllOrdersByAdmin);

router.get('/:id', authenticateToken, controller.getOrderById);

router.post('/', authenticateToken, controller.createOrder);

router.delete('/:id', authenticateToken, controller.deleteOrderById);



module.exports = router;
