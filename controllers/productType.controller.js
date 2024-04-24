const ProductType = require('../models/ProductType');
const ProductTypeValidate = require('../validations/productType');


module.exports = {
  getProductTypes: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || 10);
      const page = parseInt(req.query.page || 1);

      const query = ProductType.find().sort({_id: -1})
        .populate('products');

      const data = await query.skip((page - 1) * limit).limit(limit);

      const totalDoc = await ProductType.countDocuments(); // Sửa lỗi ở đây
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

  getProductTypeById: async (req, res) => {
    try {
      const productTypeId = req.params.id;

      const data = ProductType.findOne({_id: productTypeId}).populate('products');

      if(!data) {
        return res.status(404)
      }

      return res.status(200).json({
        data,
      });
    } catch (error) {
      console.error(error); // Log lỗi ra console để debug
      return res.status(500).json({ error: 'Internal server error' }); // Trả về lỗi 500 nếu có lỗi xảy ra
    }
  },

  createProductType: async (req, res) => {
    try {
      const { error } = ProductTypeValidate(req.body);
      if (error) {
        return res.status(400).send({ 'error': error.details[0].message });
      }

      const { name, description } = req.body;

      const newProductType = new ProductType({
        name,
        description
      });

      const savedProductType = await newProductType.save();

      return res.status(201).json({ data: savedProductType });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateProductType: async (req, res) => {
    try {
      const productTypeId = req.params.id;

      const existingProductType = await ProductType.findById(productTypeId);
      if (!existingProductType) {
        return res.status(404).json({ error: 'Không tìm thấy loại sản phẩm' });
      }

      const { name, description } = req.body;

      existingProductType.name = name || existingProductType.name;
      existingProductType.description = description || existingProductType.description;

      const updatedProductType = await existingProductType.save();

      return res.status(200).json({ data: updatedProductType });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Lỗi server nội bộ' });
    }
  },

  deleteProductType: async (req, res) => {
    try {
      const productTypeId = req.params.id;

      const existingProductType = await ProductType.findById(productTypeId);
      if (!existingProductType) {
        return res.status(404).json({ error: 'Không tìm thấy loại sản phẩm' });
      }

      await existingProductType.remove();

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Lỗi server nội bộ' });
    }
  }
}