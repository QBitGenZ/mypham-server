const Cart = require('../models/Cart');

// Lấy giỏ hàng của người dùng
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.status(200).send({data: cart});
  } catch (error) {
    res.status(500).json({ error: 'Lỗi nội bộ' });
  }
};

// Thêm một mặt hàng vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.equals(req.body.product));
    if (existingItem) {
      existingItem.quantity += req.body.quantity;
    } else {
      cart.items.push(req.body);
    }

    await cart.save();
    res.status(201).send({data: cart});
  } catch (error) {
    res.status(500).json({ error: 'Lỗi nội bộ' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const itemIndex = cart.items.findIndex(item => item._id.equals(req.params.id));

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    const updatedItem = req.body;
    cart.items[itemIndex].quantity = updatedItem.quantity;


    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi nội bộ' });
  }
};

// Xóa một mặt hàng khỏi giỏ hàng
exports.deleteCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const itemIndex = cart.items.findIndex(item => item._id.equals(req.params.id));

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Khoong timg thấy sản phẩm' });
    }

    cart.items.splice(itemIndex, 1);

    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    await cart.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Lỗi nội bộ' });
  }
};
