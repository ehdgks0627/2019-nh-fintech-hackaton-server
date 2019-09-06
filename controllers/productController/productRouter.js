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

    if(!req.session.name){
        res.send({'status': false});
        console.log("no session");
        return ;
    }

    console.log(match);
    Nutrient.collection.findOne({product_name: match}, (err, nutrient) =>{
        if(nutrient){
            User.find({ name: req.session.name }, (err, user) => { 
                if(!user){ res.send({'status':false}); return ;}
        
                Product.collection.insert({ nutrient_id: nutrient[0].nutrient_id,
                                        product_name: req.body.product_name,
                                        product_category: req.body.product_category,
                                        product_price: req.body.product_price,
                                        product_photo: req.body.product_photo,
                                        product_content: req.body.product_content,
                                        product_filter: req.body.product_filter,
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


router.get('/:type', (req, res) => {
    if(!req.session.name){
        Product.find({}, (err, product) => {
            if(err){ res.send( {'status':false} ); }
            res.send({ 'status': true, 'data': product });
        });
        return ;
    }

    User.find({ name: req.session.name }, (err, user) => { 
        if(!user){ res.send( {'status':false} ); return ;}

        if(req.params.type === "fit"){
            Product.find({ product_filter: { $lt: user[0].foodValue }}, (err, product) => {
                if(err){ res.send( {'status':false} ); return ;}
                res.send({ 'status': true, 'data': product });
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
    if(!req.session.name){
        Product.find({}, (err, product) => {
            if(err){ res.send( {'status':false} ); }
            res.send({ 'status': true, 'data': product });
        });
        return ;
    }

    User.find({ name: req.session.name }, (err, user) => { 
        if(!user){ res.send( {'status':false} ); return ;}

        if(req.params.id){
            Product.find({product_id: req.params.id}, (err, product) => {
                if(err){ res.send( {'status':false} ); return ;}
                Nutrient.collection.findOne({nutrient_id: product[0].nutrient_id}, (err, nutrient) =>{
                    res.send({'status':true, 'data':{'product': product[0], 'nutrient': nutrient}});addasdsakm
                });
                res.send({ 'status': true, 'data': product });
            });
        }else{
            res.send({'status': false});
        }
    });
});




module.exports = router;