const express = require('express');
const expressSession = require('express-session');
const router = express.Router();
const db = require('../../database/model.js');
const mongoose = require('mongoose');

var User = mongoose.model('UserSchema', db.UserSchema);
var Cart = mongoose.model('CartSchema', db.CartSchema);

router.post('/join', (req, res) => {
    console.log(req.body);
    User.find({ name: "user1"  }, (err, user) => {
        if (user[0]) {
            res.send({ 'status': false });
        } else {
            Cart.collection.insert({name: "user1"}, (err, cart) => {
                var cartId = cart['ops'][0]._id;
            
                User.collection.insert({ name: "user1",
                                        password: req.body.password,
                                        weight: req.body.weight,
                                        height: req.body.height,
                                        gender: req.body.gender,
                                        age: req.body.age,
                                        food_value: req.body.foodValue,
                                        cart_id: cartId
                                    }, (err, user) => {
                    if (!err) {
                        res.send({ 'status': true });
                    } else {
                        res.send({ 'status': false });
                        console.log(err);
                    }
                });
            });
        }
    });
});

router.post('/login', (req, res) => {
    User.find({ name: "user1", password: req.body.password}, (err, user) => {
        user = user[0];
	console.log(req.body);
	console.log(user);
        if (err) {
            res.send({'status': false});
            console.log(err);
        } else if (user) {
            req.session.name = user.name;
	    console.log(req.session);
            res.send({'status': true});
        } else {
            res.send({'status': true});
        }
    });
});


router.get('/', (req, res) => {
    session = req.session.name;
    if (session === undefined) {
        res.send({ 'status': false });
    } else {
        User.find({ name: session }, (err, user) => {
            user = user[0];
            res.send({'status': true, 'data':{'_id': user._id, 'name': user.name, 'weight': user.weight, 'height': user.height, 'gender': user.gender, 'age': user.age, 'foodValue': user.food_value, 'cartId': user.cart_id, 'orders':user.order_id}});
        });
    }
});

router.put('/', (req, res) => {
    session = req.session.name;
    if (session === undefined) {
        res.send({ 'status': false });
    } else {
        User.update({ name: session }, {$set: {'food_value': req.body.food_value}}, (err, user) => {
            if(err){
                res.send({'status': false});
                console.log("update error");
            }else{
                res.send({'status': true});
            }            
        });
    }  
});


module.exports = router;
