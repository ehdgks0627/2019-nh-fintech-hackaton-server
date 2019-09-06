const express = require('express');
const router = express.Router();
const db = require('../../database/model.js');
const mongoose = require('mongoose');
const multer = require('multer');


var User = mongoose.model('UserSchema', db.UserSchema);
var Product = mongoose.model('ProductSchema', db.ProductSchema);
var Cart = mongoose.model('CartSchema', db.CartSchema);
var Nutrient = mongoose.model('NutrientSchema', db.NutrientSchema);


router.put('/', function (req, res) {
    if(!req.session.name){
        res.send({'status': false});
        console.log("no session");
        return ;
    }
    
    User.findOne({name: req.session.name}, (err, user) => {
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
    if(!req.session.name){
        res.send({'status': false});
        console.log("no session");
        return ;
    }

    User.findOne({name: req.session.name}, (err, user) => {
        if(!user){ res.send({'status': false}); return; }

        Cart.find({name: req.session.name}, (err, cart) => {
            console.log(cart);
	    res.send(cart);
        });
    });
});





module.exports = router;
