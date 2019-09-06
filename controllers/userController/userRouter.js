const express = require('express');
const expressSession = require('express-session');
const router = express.Router();
const db = require('../../database/model.js');
const mongoose = require('mongoose');

var User = mongoose.model('UserSchema', db.UserSchema);

router.post('/join', (req, res) => {
    console.log(req.body);
    User.find({ name: req.body.name  }, (err, user) => {
        if (user[0]) {
            res.send({ 'status': false });
        } else {
            User.collection.insert({ name: req.body.name,
                                    password: req.body.password,
                                    weight: req.body.weight,
                                    height: req.body.height,
                                    gender: req.body.gender,
                                    age: req.body.age,
                                    food_value: req.body.food_value }, (err, user) => {
                if (!err) {
                    res.send({ 'status': true });
                } else {
                    res.send({ 'status': false });
                    console.log(err);
                }
            });
        }
    });
});

router.post('/login', (req, res) => {
    User.find({ name: req.body.name, password: req.body.password}, (err, user) => {
        user = user[0];
        if (err) {
            res.send({'status': false});
            console.log(err);
        } else if (user) {
            req.session.name = user.name;
            res.send({'status': true});
        } else {
            res.send({'status': false});
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
            res.send({'status': true, 'data':{'_id': user._id, 'name': user.name, 'weight': user.weight, 'height': user.height, 'gender': user.gender, 'age': user.age, 'foodValue': user.food_value}});
        });
    }
});


module.exports = router;