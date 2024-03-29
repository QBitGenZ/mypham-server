const Order = require('../models/order'); // Import model Order
const validate = require('../validations/order');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({user: req.user._id}).populate('user').populate('items.product');
    return res.status(200).send({data: orders});
  } catch (error) {
    console.error(error.message);
    res.status(500).send({error: 'Lỗi nội bộ'});
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('items.product');
    if (!order) return res.status(404).json({ error: 'Không tìm thấy' });
    return res.json({data: order});
  } catch (error) {
    console.error(error.message);
    res.status(500).send({error: 'Lỗi nội bộ'});
  }
};

exports.createOrder = async (req, res) => {
  const orderData = req.body;

  const {error} = validate(orderData);

  if(error)
    return res.status(400).send({error: error})

  const {paymentMethod, deliveryMethod, address, items} = orderData;
  const user = req.user._id;

  try {
    const newOrder = new Order({
      user, paymentMethod, deliveryMethod, address, items
    });

    // Lưu đơn hàng mới và sử dụng populate để lấy thông tin của người dùng và sản phẩm
    await newOrder.save();
    await newOrder.populate('user').populate('items.product').execPopulate();

    return res.status(201).json({data: newOrder});
  } catch (error) {
    res.status(500).send({error: 'Lỗi nội bộ'});
  }
};

exports.updateOrderById = async (req, res) => {
  const orderId = req.params.id;
  const orderData = req.body;
  orderData.user = req.user._id;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, orderData, { new: true }).populate('user').populate('items.product');
    if (!updatedOrder) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).send({error: 'Lỗi nội bộ'});
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
    res.status(500).send({error: 'Lỗi nội bộ'});
  }
};
