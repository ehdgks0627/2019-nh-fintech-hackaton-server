const express = require('express');
const router = express.Router();
const db = require('../../database/model')
const mongoose = require('mongoose');

const User = mongoose.model('UserSchema', db.UserSchema);
const Product = mongoose.model('ProductSchema', db.ProductSchema);
const Cart = mongoose.model('CartSchema', db.CartSchema);
const Nutrient = mongoose.model('NutrientSchema', db.NutrientSchema);
const Order = mongoose.model('OrderSchema', db.OrderSchema);

router.get('/', async (req, res) => {
    const userid = "user1";

    try {
        const user = await User.findOne({ name: userid });
        const cart = await Cart.findOne({ _id: user.cart_id });
        if (!cart.product_id) {
            res.status(404).send();
            return;
        }
        const productIdList = cart.product_id;
        let summaryNutInfo = [0, 0, 0, 0, 0];

        for (const productId of productIdList) {
            const product = await Product.findOne({ _id: productId });
            const nutrientId = product.nutrient_id;
            const nutrient = await Nutrient.findOne({ _id: nutrientId });
            const nutInfo = nutrient.nutrient_info.slice(1, 6);

            for (let i = 0; i < 5; i++) {
                summaryNutInfo[i] += nutInfo[i];
            }
        }

        const max = Math.max(...summaryNutInfo);
        summaryNutInfo = summaryNutInfo.map(x => (x / max) * 120);

        res.status(200).json({
            status: true,
            data: [
                {
                    status: summaryNutInfo[0],
                    recommend: await Product.findOne({ product_category: "쌀" })
                },
                {
                    status: summaryNutInfo[1],
                    recommend: await Product.findOne({ product_category: "김" })
                },
                {
                    status: summaryNutInfo[2],
                    recommend: await Product.findOne({ product_category: "감자" })
                },
                {
                    status: summaryNutInfo[3],
                    recommend: await Product.findOne({ product_category: "꿀" })
                },
                {
                    status: summaryNutInfo[4],
                    recommend: await Product.findOne({ product_category: "김" })
                }
            ]
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ status: false });
    }
});

module.exports = router;
