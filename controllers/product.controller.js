const Product = require('../models/Product');
const ProductValidate = require('../validations/product');

module.exports = {
  getProducts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || 10);
      const page = parseInt(req.query.page || 1);

      const query = Product.find().sort({_id: -1})
        .populate('type').populate('feedbacks').populate('brand');
      const data = await query.skip((page - 1) * limit).limit(limit);

      const totalDoc = await Product.countDocuments(); // Sửa lỗi ở đây
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

      const product = await Product.findOne({brand: brand}).populate('feedbacks').populate('brand').populate('type');

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
      console.log(1, req.files);

      const { error } = ProductValidate(req.body);
      if (error) {
        return res.status(400).send({ 'error': error.details[0].message });
      }


      

      // Process uploaded images
      const images = req?.files?.map(file => file.path);

      // Extract other product data
      const {
        name, type, origin, volume, weight, utility, description,
        price, cost, quantity, tags, productionDate, expiryDate, brand
      } = req.body;

      // Create new product instance
      const product = new Product({
        name, type, origin, volume, weight, utility, description,
        price, cost, quantity, tags, images, productionDate, expiryDate, brand
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

      const images = req?.files?.map(file => file.path);

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

      return res.status(204).send(); // Trả về mã status 204 (No Content) khi xóa thành công
    } catch (error) {
      console.error(error);
      return res.status(500).send({ 'error': 'Lỗi nội bộ' });
    }
  }
}