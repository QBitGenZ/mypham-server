const User = require('../models/User');
const registerValidator = require('../validations/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateAccessToken(username) {
  return jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE });
}


module.exports = {
  index: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || 10);
      const page = parseInt(req.query.page || 1);

      const query = User.find().sort({_id: -1});
      const data = await query.skip((page - 1) * limit).limit(limit);

      const totalDoc = await User.countDocuments(); // Sửa lỗi ở đây
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

  getAdmin: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || 10);
      const page = parseInt(req.query.page || 1);

      const query = User.find({userType: 'seller'}).sort({_id: -1});
      const data = await query.skip((page - 1) * limit).limit(limit);

      const totalDoc = await User.countDocuments({userType: 'seller'});
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

  getUser: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || 10);
      const page = parseInt(req.query.page || 1);

      const query = User.find({userType: 'buyer'}).sort({_id: -1});
      const data = await query.skip((page - 1) * limit).limit(limit);

      const totalDoc = await User.countDocuments({userType: 'buyer'}); // Sửa lỗi ở đây
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

  register: async (req, res) => {
    try {
      const { error } = registerValidator(req.body);

      if (error) {
        return res.status(422).send({ 'error': error.details[0].message });
      }

      const checkUsernameExist = await User.findOne({ username: req.body.username });

      if (checkUsernameExist)
        return res.status(422).send({ error: 'Username đã tồn tại' });


      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(req.body.password, salt);

      const user = new User({
        username: req.body.username,
        password: hashPass,
        fullname: req.body.fullname,
        addresses: [req.body.address], // Lưu địa chỉ từ yêu cầu gửi
        avatar: req?.file?.path || null,
        email: req.body.email,
        phone: req.body.phone,
        birthday: req.body.birthday || Date.now(),
      });

      const userCreated = await user.save(); // Lưu người dùng vào cơ sở dữ liệu
      delete userCreated.password;

      return res.status(201).send({ 'data': userCreated });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Lỗi server nội bộ' });
    }
  },

  createAdmin: async (req, res) => {
    try {
      const { error } = registerValidator(req.body);

      if (error) {
        return res.status(422).send({ 'error': error.details[0].message });
      }

      const checkUsernameExist = await User.findOne({ username: req.body.username });

      if (checkUsernameExist)
        return res.status(422).send({ error: 'Username đã tồn tại' });

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(req.body.password, salt);

      const user = new User({
        username: req.body.username,
        password: hashPass,
        fullname: req.body.fullname,
        addresses: [req.body.address], // Lưu địa chỉ từ yêu cầu gửi
        avatar: req?.file?.path || null,
        email: req.body.email,
        phone: req.body.phone,
        birthday: req.body.birthday || Date.now(),
        userType: 'seller',
      });

      const userCreated = await user.save(); // Lưu người dùng vào cơ sở dữ liệu
      delete userCreated.password;

      return res.status(201).send({ 'data': userCreated });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Lỗi server nội bộ' });
    }
  },

  updateUser: async (req, res) => {
    try{
      const username = req.user.username;

      const existUser = await User.findOne({username: username});
      if(!existUser)
        return res.status(404).body({'error': 'Không tìm thấy người dùng'});

      console.log(existUser)


      existUser.fullname = req.body.fullname || existUser.fullname;
      existUser.phone = req.body.phone || existUser.phone;
      existUser.email = req.body.email || existUser.email;
      existUser.birthday = req.body.birthday || existUser.birthday;

      if(req.body.password) {
        const salt = await bcrypt.genSalt(10);
        existUser.password = await bcrypt.hash(req.body.password, salt);
      }

      if (req.file) {
        existUser.avatar = req.file.path;
      }

      await existUser.save();

      const userData = existUser.toJSON();
      delete userData.password;

      return res.status(200).json({ data: userData });

    }
    catch (e) {
      return res.status(400).send({e});
    }
  },

  deleteUser: async (req, res) => {
    try {
      const username = req.params.username;

      existUser = User.findOne({username: username});
      if (!existUser)
        return res.status(404).send({error: 'Người dùng không tồn tại'})

      await User.findOneAndDelete({username: username});

      return res.status(204).send({});

    } catch (e) {
      return res.status(500).send({'error': 'Lỗi nội bộ'});
    }
  },

  deleteUserSelf: async (req, res) => {
    try {
      const username = req.user.username

      const existUser = User.findOne({username: username});
      if (!existUser)
        return res.status(404).send({error: 'Người dùng không tồn tại'})

      await User.findOneAndDelete({username: username});

      return res.status(204).send({});

    } catch (e) {
      return res.status(500).send({'error': 'Lỗi nội bộ'});
    }
  },

  login: async (req, res) => {
    try {


      const username = req.body.username || '';
      const password = req.body.password || '';

      const user = await User.findOne({username: username});
      if (!user) {
        return res.status(401).send('Tên đăng nhập không tồn tại.');
      }


      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Mật khẩu không chính xác.');
      }


      const accessToken = generateAccessToken(username);
      return res.status(200).send({ 'access_token': accessToken });


    }
    catch (e) {
      return res.status(500).send({error: 'Lỗi nội bộ'});
    }
  }
}
