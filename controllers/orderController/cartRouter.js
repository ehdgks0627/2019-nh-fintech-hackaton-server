const express = require('express');
const router = express.Router();
const db = require('../../database/model.js');
const mongoose = require('mongoose');
const multer = require('multer');


var User = mongoose.model('UserSchema', db.UserSchema);
var Product = mongoose.model('ProductSchema', db.ProductSchema);
var Cart = mongoose.model('CartSchema', db.CartSchema);
var Nutrient = mongoose.model('NutrientSchema', db.NutrientSchema);
var Order = mongoose.model('OrderSchema', db.OrderSchema);

router.put('/', function (req, res) {
    if(!"user1"){
        res.send({'status': false});
        console.log("no session");
        return ;
    }

    User.findOne({name: "user1"}, (err, user) => {
        if(!user){ res.send({'status': false}); return; }
        console.log(user);
        Cart.update({_id: user.cart_id}, {$push : { product_id : req.body.product_id}}, (err, cart) => {
            console.log(cart);
            console.log(err);
            if(cart){
                res.send({'status': true});
            }else{
                res.send({'status': false});
            }
        });
    });
});

router.get('/', function (req, res) {
    if(!"user1"){
        res.send({'status': false});
        console.log("no session");
        return ;
    }

    User.findOne({name: "user1"}, (err, user) => {
        if(!user){ res.send({'status': false}); return; }
        Cart.find({_id: user.cart_id}, (err, cart) => {
            var products = cart[0].product_id
            var result = []
            for(var i=0; i<products.length; i++) {
                console.log(products[i]);
                Product.findOne({product_id: products[i]._id}, (err, product) => {
                    result.push(product)
                    if (result.length == products.length) {
                        res.send({'status': true, 'data': result});
                    }
                })
            }
        });
    });
});

router.get('/test', function (req, res){
    Cart.find({name: req.body.name}, (err, cart) => {
        console.log(cart);
    });
});

router.delete('/', function (req, res) {
    if(!"user1"){
        res.send({'status': false});
        console.log("no session");
        return ;
    }

    User.findOne({name: "user1"}, (err, user) => {
        if(!user){ res.send({'status': false}); return; }

    Cart.find({name: "user1"}, (err, cart) => {
        Cart.collection.insert({name: "user1"}, (err, new_cart) => {
            User.update({name: "user1"}, {$set: {cart_id: new_cart.ops[0]._id } }, (err, user) => {
                cart = cart[0]
                    Order.collection.insert({order_state: 0, cart_id: cart._id}, (err, order) => {
                        if(!order) { res.send({'status': false}); return ; }
                        res.send({'status': true});
                        return;
                    });
                });
            });
        });
    });
});


module.exports = router;
