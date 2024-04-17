const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const {referrerPolicy} = require('./middlewares/cors');

const userRoute = require('./routes/user.route');
const productRoute = require('./routes/product.route');
const productTypeRoute = require('./routes/productType.route');
const feedbackRoute = require('./routes/feedback.route');
const cartRoute = require('./routes/cart.route');
const orderRoute = require('./routes/order.route');
const vnpayRoute = require('./routes/payment.route');
const brandRoute = require('./routes/brand.route');
const statisticsRoute = require('./routes/statistics.route');

const app = express();

dotenv.config();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'Content-Length']
}));
app.options('*', cors());
app.use('/uploads/', express.static(path.join(__dirname, 'uploads')));

//use route
app.use(`/${process.env.API_VERSION}/`, userRoute);
app.use(`/${process.env.API_VERSION}/products/`, productRoute);
app.use(`/${process.env.API_VERSION}/product-types/`, productTypeRoute);
app.use(`/${process.env.API_VERSION}/feedbacks/`, feedbackRoute);
app.use(`/${process.env.API_VERSION}/carts/`, cartRoute);
app.use(`/${process.env.API_VERSION}/orders/`, orderRoute);
app.use(`/${process.env.API_VERSION}/brands/`, brandRoute);
app.use(`/${process.env.API_VERSION}/statistics/`, statisticsRoute);
app.use(`/${process.env.API_VERSION}/payments/`, referrerPolicy, vnpayRoute);



// kết nối database
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('connected database'))
  .catch((err) => console.log(err));


module.exports = app;
