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
    order_timestamp: { type: Date, default: Date.now },
})

exports.NutrientSchema = new Schema({
    nutrient_id: Number,
    code: String, // 식품 코드
    category: String, // 식품군
    name: String, // 이름
    Eng: Number, // 열량, kcal
    Car: Number, // 탄수화물, g
    Pro: Number, // 단백질, g
    Fat: Number, // 지방, g
    Tsg: Number, // 당류, g
    Na: Number, // 나트륨, mg
    CHOLE: Number, // 콜레스테롤, mg
    SFA: Number, // 포화지방산, g
    TFA: Number, // 트랜스지방산, g
    name_english: String, // 영문 이름
    origin: String, // 원산지
});