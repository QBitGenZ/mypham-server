const Order = require('../models/order'); 
const validate = require('../validations/order');
const Product = require('../models/Product');

exports.getAllOrdersByAdmin = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || 10);
    const page = parseInt(req.query.page || 1);

    const query = Order.find().sort({_id: -1}).populate('user').populate('items.product');
    const data = await query.skip((page - 1) * limit).limit(limit);

    const totalDoc = await Order.countDocuments(); // Sửa lỗi ở đây
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
}

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('user').populate('items.product');
    return res.status(200).send({ data: orders });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Lỗi nội bộ' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('items.product');
    if (!order) return res.status(404).json({ error: 'Không tìm thấy' });
    return res.json({ data: order });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Lỗi nội bộ' });
  }
};

exports.createOrder = async (req, res) => {
  const orderData = req.body;

  const { error } = validate(orderData);

  if (error) {
    return res.status(400).send({ error: error });
  }

  const { paymentMethod, deliveryMethod, address, items } = orderData;
  const user = req.user._id;

  try {
    const newOrder = new Order({
      user, paymentMethod, deliveryMethod, address, items
    });


    for(const item of items) {
      const product = await Product.findById(item.product)
      if(!product) {
        return res.status(404).send({error: 'Không tìm thấy sản phẩm'})
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: 'Số lượng sản phẩm không đủ' });
      }
      product.quantity -= item.quantity

      
      await newOrder.save();
    }

    // Lấy thông tin của người dùng và sản phẩm sau khi đơn hàng đã được lưu
    const populatedOrder = await Order.findById(newOrder._id).populate('user').populate('items.product');

    return res.status(201).json({ data: populatedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Lỗi nội bộ' });
  }
};

exports.updateOrderById = async (req, res) => {
  const orderId = req.params.id;
  const orderData = req.body;
  orderData.user = req.user._id;

  try {
    const order = await Order.findById(orderId)
    if(!order)
      return res.status(404).send({'error': 'Không tồn tại sản phẩm'})

    order.paymentMethod = orderData.paymentMethod || order.paymentMethod;
    order.deliveryMethod = orderData.deliveryMethod || order.deliveryMethod;
    order.address = orderData.address || order.address;
    order.items = orderData.items || order.items;
    order.status = orderData.status || order.status;

    const updatedOrder = await order.save();
    console.log('Đã save')
    updateOrder = updateOrder.populate('user').populate('items.product');

    res.json(updatedOrder);
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Lỗi nội bộ' });
  }
};

exports.deleteOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) return res.status(404).json({ msg: 'Không tìm thấy' });
    return res.sendStatus(204);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Lỗi nội bộ' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('user').populate('items.product');
    return res.status(200).send({ data: orders });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Lỗi nội bộ' });
  }
}
