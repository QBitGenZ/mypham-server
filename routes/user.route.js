const router = require('express').Router();
const controller = require('../controllers/user.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const {authenticateToken,  isAdmin} = require('../middlewares/authentication')

// Lấy danh sách các user
router.get('', authenticateToken, isAdmin, controller.index);

router.get('/admin', authenticateToken, isAdmin, controller.getAdmin);

router.get('/user', authenticateToken, isAdmin, controller.getUser);

// Thêm user mua đăng ký
router.post('/register', upload.single('avatar'), controller.register);

// Người user người bán
router.post('/admin', upload.single('avatar'), controller.createAdmin);

// Chỉnh sửa thông tin user
router.put('/:username', authenticateToken, upload.single('avatar'), controller.updateUser);

router.delete('', authenticateToken, controller.deleteUserSelf);
//Xóa user
router.delete('/:username', authenticateToken, controller.deleteUser);


//đăng nhập
router.post('/login',upload.single('avatar'), controller.login)

module.exports = router;