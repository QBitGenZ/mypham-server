const Order = require('../models/Order'); 
const validate = require('../validations/order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.getAllOrdersByAdmin = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || 10);
    const page = parseInt(req.query.page || 1);
    const status = req.query.status || 'all';
    const isPaid = req.query.isPaid || 'all';
    console.log(1, status, req.query)

    let query = Order.find();

    if(status != 'all') {
      query = query.find({status: status})
    }
    if (isPaid === 'Đã thanh toán') {
      query = query.find({ paymentDate: { $ne: null } }); 
    } else if (isPaid === 'Chưa thanh toán') {
      query = query.find({ paymentDate: null }); 
    }


    query = query.sort({_id: -1}).populate('user').populate('items.product').populate({ path: 'items.product', populate: { path: 'brand' } });



    const data = await query.skip((page - 1) * limit).limit(limit);

    const totalDoc = await Order.countDocuments(query._conditions); // Sửa lỗi ở đây
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
    const orders = await Order.find({ user: req.user._id }).populate('user').populate('items.product').populate({ path: 'items.product', populate: { path: 'brand' } });
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

  const { paymentMethod, deliveryMethod, address, items, totalPrice } = orderData;
  const user = req.user._id;

  try {
    const newOrder = new Order({
      user, paymentMethod, deliveryMethod, address, items, totalPrice
    });

    for(const item of items) {
      const product = await Product.findById(item.product)
      if(!product) {
        return res.status(404).send({error: 'Không tìm thấy sản phẩm'})
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: 'Số lượng sản phẩm không đủ' });
      }
      if(paymentMethod === 'cod') {
        product.quantity -= item.quantity
        await product.save()
      }
    }

    if(paymentMethod === 'cod') {
      let cart = await Cart.findOne({user: user})
            console.log(cart)
            if (cart) {
                for (let item of items) {
                    let cartItem = cart.items.find(cartItem => cartItem.product.toString() === item.product.toString());
                    if (cartItem) {
                        cartItem.quantity -= item.quantity;
                        if (cartItem.quantity <= 0) {
                          cart.items.pull(cartItem._id);
                        }
                    }
                }
                await cart.save();
            }
    }

    await newOrder.save();
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
  console.log("body", req.body)

  try {
    const order = await Order.findById(orderId)
    if(!order)
      return res.status(404).send({'error': 'Không tồn tại sản phẩm'})

    console.log(req.body)

    order.paymentMethod = orderData.paymentMethod || order.paymentMethod;
    order.deliveryMethod = orderData.deliveryMethod || order.deliveryMethod;
    order.address = orderData.address || order.address;
    order.items = orderData.items || order.items;
    order.status = orderData.status || order.status;

    if(orderData.status === 'Đã giao' && order.paymentMethod === 'cod') {
      order.paymentDate = Date.now();
    } 

    const updatedOrder = await order.save();
    console.log('Đã save')
    // Tạo một truy vấn Mongoose mới và sử dụng populate trên đó
    const populatedOrder = await Order.findById(orderId)
      .populate('user')
      .populate('items.product')
      .exec();
    
    res.json(populatedOrder);
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
