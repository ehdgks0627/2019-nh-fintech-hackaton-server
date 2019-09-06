const express = require('express');
const router = express.Router();
const db = require('../../database/model.js');
const mongoose = require('mongoose');
const constJs = require('./constant.js');
const multer = require('multer');


var User = mongoose.model('UserSchema', db.UserSchema);
var Product = mongoose.model('ProductSchema', db.ProductSchema);
var Nutrient = mongoose.model('NutrientSchema', db.NutrientSchema);


router.post('/', function (req, res) {
    if(!req.session.name){
        res.send({'status': false});
        console.log("no session");
        return ;
    }
    
});





module.exports = router;