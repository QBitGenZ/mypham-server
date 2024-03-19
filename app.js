const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const userRoute = require('./routes/user.route');
const productRoute = require('./routes/product.route');
const productTypeRoute = require('./routes/productType.route');
const feedbackRoute = require('./routes/feedback.route');

const app = express();

dotenv.config();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads/', express.static(path.join(__dirname, 'uploads')));

//use route
app.use(`/${process.env.API_VERSION}/`, userRoute);
app.use(`/${process.env.API_VERSION}/products/`, productRoute);
app.use(`/${process.env.API_VERSION}/product-types/`, productTypeRoute);
app.use(`/${process.env.API_VERSION}/feedbacks/`, productTypeRoute);


// kết nối database
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('connected database'))
  .catch((err) => console.log(err));


module.exports = app;
