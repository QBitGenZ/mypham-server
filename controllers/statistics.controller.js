// const Order = require('../models/Order');
// const Product = require('../models/Product');

module.exports = {
  getRevenueByMonth: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!start) {
        start = new Date();
        start.setMonth(start.getMonth() - 12);
        start.setDate(1);
      }

      if (!end) {
        end = new Date();
      }

      const orders = await Order.find({
        paymentDate: { $gte: start, $lte: end }
      });

      const revenueByMonth = {};

      orders.forEach(order => {
        const monthYearKey = `${order.paymentDate.getMonth() + 1}-${order.paymentDate.getFullYear()}`;
        if (revenueByMonth[monthYearKey]) {
          revenueByMonth[monthYearKey] += order.totalPrice || 0;
        } else {
          revenueByMonth[monthYearKey] = order.totalPrice || 0;
        }
      });
      res.status(200).json({ data: revenueByMonth });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getInventory: async (req, res) => {
    try {
      const products = await Product.find();
      const inventory = {};

      products.forEach(product => {
        if (product.quantity) {
          inventory[product.name] = product.quantity;
        }
      });

      res.status(200).json({ data:inventory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBestSellingProducts: async (req, res) => {
    try {
      const completedOrders = await Order.find({ status: 'Đã giao' });

      const productSales = {};

      completedOrders.forEach(order => {
        order.items.forEach(item => {
          const productId = item.product.toString();
          if (productSales[productId]) {
            productSales[productId] += item.quantity;
          } else {
            productSales[productId] = item.quantity;
          }
        });
      });

      const sortedProducts = Object.keys(productSales).sort((a, b) => {
        return productSales[b] - productSales[a];
      });

      const topProductsIds = sortedProducts.slice(0, 10);

      const bestSellingProducts = await Promise.all(topProductsIds.map(async productId => {
        const product = await Product.findById(productId);
        return {
          _id: product._id,
          name: product.name,
          quantitySold: productSales[productId]
        };
      }));

      res.status(200).json({ data: bestSellingProducts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

}