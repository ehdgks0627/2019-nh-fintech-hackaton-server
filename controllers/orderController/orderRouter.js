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
    
    User.findOne({name: "user1"}, (err, user) => {
        if(!user){ res.send({'status': false}); return; }
        Cart.update({_id: user.cart_id}, {$push : { product_id : req.body.product_id}}, (err, cart) => {
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

        Cart.find({name: "user1"}, (err, cart) => {
            res.send({'status': true, 'data': cart});
        });
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
	    Cart.update({_id: user.cart_id}, {$pullAll : { product_id: [req.body.product_id]}}, (err, cart) => {
	        res.send({'status': true, 'data': cart});
		Order.insert({order_state: 0, cart_id: cart._id}, (err, order) => {
			if(!order){ res.send({'status': false}); return ; }
			res.send({'status': true});
			console.log(order);
			return ;
		});   
	    });
        });

    });
});


module.exports = router;
