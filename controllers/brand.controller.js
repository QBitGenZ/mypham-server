const Brand = require('../models/Brand')

module.exports = {
  getBrands: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || 10);
      const page = parseInt(req.query.page || 1);
  
      const query = Brand.find().sort({_id: -1});
      const data = await query.skip((page - 1) * limit).limit(limit);
  
      const totalDoc = await Brand.countDocuments(); // Sửa lỗi ở đây
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

  getBrandById: async (req, res) => {
    const brandId = req.params.id;
    try{
      const brand = await Brand.findById(brandId)
      
      if(!brand) {
        return res.status(200).send({error: 'Không tìm thấy nhãn hàng'})
      }

      return res.status(204).send({data: brand});
    }
    catch(err) {
      console.log(err)
      res.status(500).send({ error: err });
    }
  },

  createBrand: async (req, res) => {
    const {name, text} =  req.body
    try {
      const newBrand = new Brand(
        {
          name, text
        }
      )
      await newBrand.save();

      return res.status(201).send({data: newBrand});
    }
    catch(err) {
      console.log(err)
      res.status(500).send({ error: err });
    }
  },

  updateBrand: async (req, res) => {
    const brandId= req.params.id;
    const {name, text} = req.body;

    try{
      const brand = await Brand.findById(brandId)
      if(!brand) {
        return res.status(200).send({error: 'Không tìm thấy nhãn hàng'})
      }

      brand.name = name || brand.name,
      brand.text = text || brand.text

      brand.save()

      return res.status(200).send({data: brand});
    }
    catch(err) {
      console.log(err)
      res.status(500).send({ error: err });
    }
  },

  deleteBrand: async (req, res) => {
    const brandId = req.params.id;
    try{
      const brand = await Brand.findByIdAndDelete(brandId)
      
      if(!brand) {
        return res.status(200).send({error: 'Không tìm thấy nhãn hàng'})
      }

      return res.status(204).send();
    }
    catch(err) {
      console.log(err)
      res.status(500).send({ error: err });
    }
  }
}