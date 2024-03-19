const router = require('express').Router();
const controller = require('../controllers/user.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const authentication = require('../middlewares/authentication')

// Lấy danh sách các user
router.get('', controller.index);

router.get('/admin', controller.getAdmin);

router.get('/user', controller.getUser);

// Thêm user mua đăng ký
router.post('/register', upload.single('avatar'), controller.register);

// Người user người bán
router.post('/admin', upload.single('avatar'), controller.createAdmin);

// Chỉnh sửa thông tin user
router.put('/:username', upload.single('avatar'), controller.editUser);

//Xóa user
router.delete('/:username', authentication, controller.deleteUser);

//đăng nhập
router.post('/login',upload.single('avatar'), controller.login)

module.exports = router;