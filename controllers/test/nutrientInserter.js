const express = require('express');
const router = express.Router();
const db = require('../../database/model.js');
const mongoose = require('mongoose');

var Nutrient = mongoose.model('NutrientSchema', db.NutrientSchema);

router.post('/', (req, res) => {
    console.log(req.body);
    Nutrient.collection.insert({ code: req.body.code,
                                category: req.body.category,
                                name: req.body.name,
                                nutrient_info: req.body.nutrient_info,
                                name_english: req.body.name_english,
                                origin: req.body.origin}, (err, user) => {
        if (!err) {
	    console.log(user);
            res.send({ 'status': true });
        } else {
            res.send({ 'status': false });
            console.log(err);
        }
    });
});


module.exports = router;
