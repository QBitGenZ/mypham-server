const Product = require('../models/Product');
const Order = require('../models/Order');


module.exports = {
  getRevenueByMonth: async (req, res) => {
    try {
        let { startDate, endDate } = req.query;

        const defaultStart = new Date();
        defaultStart.setMonth(defaultStart.getMonth() - 11);

        const start = startDate ? new Date(startDate) : defaultStart;
        const end = endDate ? new Date(endDate) : new Date();

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const orders = await Order.find({
            paymentDate: { $gte: start, $lte: end }
        });

        const revenueByMonth = {};
        const monthsInRange = [];

        let currentDate = new Date(start);

        while (currentDate <= end) {
            monthsInRange.push(`${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`);
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        monthsInRange.forEach(monthYearKey => {
            revenueByMonth[monthYearKey] = 0;
        });

        orders.forEach(order => {
            const monthYearKey = `${order.paymentDate.getMonth() + 1}-${order.paymentDate.getFullYear()}`;
            revenueByMonth[monthYearKey] += order.totalPrice || 0;
        });

        const sortedMonths = Object.keys(revenueByMonth).sort((a, b) => {
          const [aMonth, aYear] = a.split('-').map(Number);
          const [bMonth, bYear] = b.split('-').map(Number);
          return aYear === bYear ? aMonth - bMonth : aYear - bYear;
        });

        const sortedRevenueByMonth = {};
        sortedMonths.forEach(month => {
            sortedRevenueByMonth[month] = revenueByMonth[month];
        });

        res.status(200).json({ data: sortedRevenueByMonth });
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

  getExpiredProducts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || 10);
      const page = parseInt(req.query.page || 1);

      const currentDate = new Date();

      const query = Product.find(
        {
          expiryDate: { $lt: currentDate }
        }
      ).sort({_id: -1})
        .populate('type').populate('feedbacks').populate('brand');
      const data = await query.skip((page - 1) * limit).limit(limit);

      const totalDoc = await Product.countDocuments(); 
      const totalPage = Math.ceil(totalDoc / limit);

      return res.status(200).json({
        data,
        meta: {
          page,
          limit,
          totalDoc,
          totalPage,
        }
      });
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
}