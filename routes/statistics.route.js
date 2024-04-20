const router = require('express').Router();
const {authenticateToken, isAdmin} = require('../middlewares/authentication');
const controller = require('../controllers/statistics.controller');

router.get('/revenue', authenticateToken, isAdmin, controller.getRevenueByMonth);
router.get('/inventory', authenticateToken, isAdmin, controller.getInventory);
router.get('/best-seller', authenticateToken, isAdmin, controller.getBestSellingProducts);
router.get('/expired-products', authenticateToken, isAdmin, controller.getExpiredProducts);

module.exports = router;
