var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.UserSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	password: String,
	weight: Number,
	height: Number,
	gender: Boolean,
	age: Number,
    cart_id: Number,
    order_id: [Number],
});

exports.ProductSchema = new Schema({
    product_id: Number,
    nutrient_id: Number,
    product_name: String,
    product_price: Number,
    product_photo: String,
    product_content: String,
    product_filter: Number,
});

exports.CartSchema = new Schema({
    cart_id: Number,
    item_id: [Number],
});

exports.ItemSchema = new Schema({
    item_id: Number,
    product_id: Number,
    item_qty: Number,
});

exports.OrderSchema = new Schema({
    order_id: Number,
    order_status: Number,
    cart_id: Number,
    order_timestamp: { type : Date, default: Date.now },
})

exports.NutrientSchema = new Schema({
    nutrient_id: Number,
    
    //영양소 테이블 컬럼 추가 필요

});