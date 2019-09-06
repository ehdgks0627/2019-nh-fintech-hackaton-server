const express = require('express');
const router = express.Router();
const db = require('../../database/model.js');
const mongoose = require('mongoose');
var stringSimilarity = require('string-similarity');
const constJs = require('./constant.js');
const multer = require('multer');


var User = mongoose.model('UserSchema', db.UserSchema);
var Product = mongoose.model('ProductSchema', db.ProductSchema);
var Nutrient = mongoose.model('NutrientSchema', db.NutrientSchema);


router.post('/', function (req, res) {
    console.log(req.body);

    if(!"user1"){
        res.send({'status': false});
        console.log("no session");
        return ;
    }

    
    Nutrient.collection.findOne({name: req.body.product_category}, (err, nutrient) =>{
        console.log(nutrient)
        if(nutrient){
            User.find({ name: "user1" }, (err, user) => { 
                if(!user){ res.send({'status':false}); return ;}
                console.log(nutrient);
                Product.collection.insert({ nutrient_id: nutrient._id,
                                        product_name: req.body.product_name,
                                        product_category: req.body.product_category,
                                        product_price: req.body.product_price,
                                        product_photo: req.body.product_photo,
                                        product_content: req.body.product_content,
                                        product_filter: parseInt(req.body.product_filter),
                                        product_seller: user[0].name,
                                    }, (err, user) => {
                    if (!err) {
                        res.send({ 'status': true });
                    } else {
                        res.send({ 'status': false });
                        console.log(err);
                    }
                });
            });
        }else{
            res.send({ 'status': false });
            console.log("no nutrient");
        }
    });

});

router.get('/test', (req, res) => {
	Nutrient.find({}, (err, nutrients) => {
	    res.send(nutrients);
	});
});

router.get('/:type', (req, res) => {
    if(!"user1"){
        Product.find({}, (err, product) => {
            if(err){ res.send( {'status':false} ); }
            res.send({ 'status': true, 'data': product });
        });
        return ;
    }

    User.find({ name: "user1" }, (err, user) => { 
        if(!user){ res.send( {'status':false} ); return ;}

        if(req.params.type === "fit"){
	    console.log(req.params.type);
		console.log(user[0], "test");
            Product.find({product_filter: {$lte: user[0].food_value}}, (err, product) => {
		console.log(err);
		console.log(product);
                if(!product){ res.send( {'status':false} ); return ;}
                res.send({ 'status': true, 'data': product });
		console.log("test!!!!!");
            });
        }else{
            Product.find({}, (err, product) => {
                if(err){ res.send( {'status':false} ); }
                res.send({ 'status': true, 'data': product });
            });
        }
    });
});

router.get('/detail/:id', (req, res) => {
   console.log(req.params);
//   if(!"user1"){
//        Product.find({}, (err, product) => {
//            if(err){ res.send( {'status':false} ); }
//            res.send({ 'status': true, 'data': product });
//        });
//        return ;
//    }

    User.find({ name: "user1" }, (err, user) => { 
        //if(!user){ res.send( {'status':false} ); return ;}

        if(req.params.id){
            Product.find({_id: req.params.id}, (err, product) => {
                if(err){ res.send( {'status':false} ); return ;}
                Nutrient.findOne({_id: product[0].nutrient_id}, (err, nutrient) =>{
		console.log('test',nutrient);
		    if(nutrient){
                    	res.send({'status':true, 'data':{'product': product[0], 'nutrient': nutrient}});
		    }else{
		    	res.send({'status': false});
		    }
		    return; 
                });
            });
        }else{
            res.send({'status': false});
        }
    });
});





module.exports = router;
