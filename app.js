const express = require('express');
const path = require('path');
const app = express();
const db = require('./database/db.js');
const userRoute = require('./controllers/userController/userRouter');
const productRoute = require('./controllers/productController/productRouter');
const nutrientRoute = require('./controllers/test/nutrientInserter');
const cartRoute = require('./controllers/orderController/cartRouter');
const recommendRoute = require('./controllers/recommentController/recommendRouter');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const mongoose = require('mongoose');

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
db();

app.use(expressSession({
	key: 'NHMARKET_SID',
	secret: 'f={/jBwJ:#.euKSyxFb9eF{mwQaYR6',
	saveUninitialized: true,
	resave: false,
	cookie: { expire: new Date(Date.now + 60 * 60), singed: true }
}));

app.use(express.static('/productPhoto/'));

app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/nutrient', nutrientRoute);
app.use('/cart', cartRoute);
app.use('/recommend', recommendRoute);

var User = mongoose.model('UserSchema', db.UserSchema);
var Product = mongoose.model('ProductSchema', db.ProductSchema);
var Cart = mongoose.model('CartSchema', db.CartSchema);
var Order = mongoose.model('OrderSchema', db.OrderSchema);


//User.collection.remove();
//Product.collection.remove();
//Cart.collection.remove();
//Order.collection.remove();

app.listen(80, () => {
	console.log('Express App on port 80!');
});
