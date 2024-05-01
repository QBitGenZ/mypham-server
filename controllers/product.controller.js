const Product = require('../models/Product');
const ProductType = require('../models/ProductType');
const Brand = require('../models/Brand');
const Order = require('../models/Order');
const ProductValidate = require('../validations/product');

module.exports = {
  getProducts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || 10);
      const page = parseInt(req.query.page || 1);
      const type = req.query.type;
      const brand = req.query.brand;

      const currentDate = new Date();
      let query = Product.find({ expiryDate: { $gte: currentDate }, quantity: { $gt: 0 } }).sort({_id: -1})
        .populate('type').populate('feedbacks').populate('brand');

      if (type) {
        const productType = await ProductType.findOne({ name: type });
        if (productType) {
          query = query.where('type').equals(productType._id);
        } 
      }

      if (brand) {
        const brandProduct = await Brand.findOne({ name: brand });
        if(brandProduct) {
          query = query.where('brand').equals(brandProduct._id);
        }
      }
    

      const data = await query.skip((page - 1) * limit).limit(limit);
   
      const totalDoc = await Product.countDocuments(query._conditions);
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
      console.error(error); // Log lỗi ra console để debug
      return res.status(500).json({ error: 'Internal server error' }); // Trả về lỗi 500 nếu có lỗi xảy ra
    }
  },

  getBestSellingProducts: async (req, res) => {
    try {
      const completedOrders = await Order.find({ status: 'Đã giao' })

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

      const topProductsIds = sortedProducts.slice(0, 5);

      const bestSellingProducts = await Promise.all(topProductsIds.map(async productId => {
        const product = await Product.findById(productId).populate('type').populate('feedbacks').populate('brand');
        ;;
        return {
          product: product,
          quantitySold: productSales[productId]
        };
      }));

      res.status(200).json({ data: bestSellingProducts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductsByAdmin: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || 10);
      const page = parseInt(req.query.page || 1);
      const type = req.query.type;
      const brand = req.query.brand;

      let query = Product.find().sort({name: -1})
        .populate('type').populate('feedbacks').populate('brand');

      if (type) {
        const productType = await ProductType.findOne({ name: type });
        if (productType) {
          query = query.where('type').equals(productType._id);
        } 
      }

      if (brand) {
        const brandProduct = await Brand.findOne({ name: brand });
        if(brandProduct) {
          query = query.where('brand').equals(brandProduct._id);
        }
      }

      const data = await query.skip((page - 1) * limit).limit(limit);

      const totalDoc = await Product.countDocuments(query._conditions); // Sửa lỗi ở đây
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
      console.error(error); // Log lỗi ra console để debug
      return res.status(500).json({ error: 'Internal server error' }); // Trả về lỗi 500 nếu có lỗi xảy ra
    }
  },

  getProductByBrand: async (req, res) => {
    try {
      const brand = req.params.id;

      const product = await Product.findOne({brand: brand, expiryDate: { $gte: currentDate }, quantity: { $gt: 0 }}).populate('feedbacks').populate('brand').populate('type');

      if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      }

      return res.status(200).json({ data: product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Lỗi server nội bộ' });
    }
  },

  getProduct: async (req, res) => {
    try {
      const productId = req.params.id;

      const product = await Product.findById(productId).populate('feedbacks').populate('brand').populate('type');

      if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      }

      // Trả về thông tin của sản phẩm
      return res.status(200).json({ data: product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Lỗi server nội bộ' });
    }
  },

  createProduct: async (req, res) => {
    try {
      // Validate product data
      req.body.tags = JSON.parse(req.body.tags)
      delete req.body.images;

      const { error } = ProductValidate(req.body);
      if (error) {
        return res.status(400).send({ 'error': error.details[0].message });
      }

      // Process uploaded images
      const images = req.files.images.map(file => file.path);
      const videoUrl = req.files.video ? req.files.video[0].path : '';

      // Extract other product data
      const {
        name, type, origin, volume, weight, utility, description,
        price, cost, quantity, tags, productionDate, expiryDate, brand
      } = req.body;

      // Create new product instance
      const product = new Product({
        name, type, origin, volume, weight, utility, description,
        price, cost, quantity, tags, images, productionDate, expiryDate, brand, videoUrl, sale: 0
      });

      // Save the product to the database
      const savedProduct = await product.save();

      return res.status(201).json({ 'data': savedProduct });
    } catch (e) {
      console.error(e);
      return res.status(500).send({ 'error': 'Lỗi nội bộ' });
    }
  },

  updateProduct: async (req, res) => {
    try {
      // Extract product ID from request parameters
      const productId = req.params.id;

      const images = req.files?.images?.map(file => file.path);
      const videoUrl = req.files?.video ? req.files?.video[0]?.path : '';

      // Find the product by ID
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send({ 'error': 'Không tìm thấy sản phẩm' });
      }

      // Update product fields based on request body
      product.name = req.body.name || product.name;
      product.type = req.body.type || product.type;
      product.origin = req.body.origin || product.origin;
      product.volume = req.body.volume || product.volume;
      product.weight = req.body.weight || product.weight;
      product.utility = req.body.utility || product.utility;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.cost = req.body.cost || product.cost;
      product.quantity = req.body.quantity || product.quantity;
      product.tags = req.body.tags || product.tags;
      product.images = images ? [...product.images, ...images] : product.images; // Thêm ảnh mới vào danh sách hiện có
      product.productionDate = req.body.productionDate || product.productionDate;
      product.expiryDate = req.body.expiryDate || product.expiryDate;
      product.feedbacks = req.body.feedbacks || product.feedbacks;
      product.brand = req.body.brand || product.brand;
      product.videoUrl = videoUrl || product.videoUrl;
      product.sale = req.body.sale || product.sale;

      // Save the updated product to the database
      const updatedProduct = await product.save();

      return res.status(200).json({ 'data': updatedProduct });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ 'error': 'Lỗi nội bộ' });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      // Extract product ID from request parameters
      const productId = req.params.id;

      // Find the product by ID and delete it
      const deletedProduct = await Product.findByIdAndDelete(productId);

      // Check if the product exists
      if (!deletedProduct) {
        return res.status(404).send({ 'error': 'Không tìm thấy sản phẩm' });
      }

      return res.status(204).send(); 
    } catch (error) {
      console.error(error);
      return res.status(500).send({ 'error': 'Lỗi nội bộ' });
    }
  },
  searchProducts: async (req, res) => {
    try {
      const keyword = req.query.keyword;
  
      let productType;
      if (keyword) {
        productType = await ProductType.findOne({ name: { $regex: new RegExp(keyword, 'i') } });
      }

      const searchConditions = [];
      if (keyword) {
        searchConditions.push(
          { name: { $regex: new RegExp(keyword, 'i') } },
          { 'brand.name': { $regex: new RegExp(keyword, 'i') } }
        );
        if (productType) {
          searchConditions.push({ type: productType._id });
        }
      }
  
      const searchResult = await Product.find({
        $or: searchConditions.length ? searchConditions : [{}] 
      }).populate('type').populate('brand');
  
      res.status(200).json({ data: searchResult });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
}