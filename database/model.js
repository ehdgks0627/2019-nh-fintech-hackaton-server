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
    food_value: Number,
    cart_id: String,
    order_id: [String],
});

exports.ProductSchema = new Schema({
    product_id: Schema.Types.ObjectId,
    nutrient_id: String,
    product_name: String,
    product_category: String,
    product_price: Number,
    product_photo: String,
    product_content: String,
    product_filter: Number,
    product_seller: String,
});

exports.CartSchema = new Schema({
    cart_id: Schema.Types.ObjectId,
    item_id: [String],
});

exports.ItemSchema = new Schema({
    item_id: Schema.Types.ObjectId,
    product_id: String,
    item_qty: Number,
});

exports.OrderSchema = new Schema({
    order_id: Schema.Types.ObjectId,
    order_status: Number,
    cart_id: Number,
    order_timestamp: { type: Date, default: Date.now },
})

exports.NutrientSchema = new Schema({
    nutrient_id: Schema.Types.ObjectId,
    code: String, // 식품 코드
    category: String, // 식품군
    name: String, // 이름
    /*
    0: 열량 (kcal)
    1: 탄수화물 (g)
    2: 단백질 (g)
    3: 지방 (g)
    4: 당류 (g)
    5: 나트륨 (mg)
    6: 콜레스테롤 (mg)
    7: 포화지방산 (g)
    8: 트랜스지방산 (g)
    */
    nutrient_info: [Number],
    name_english: String, // 영문 이름
    origin: String, // 원산지
});