const express = require('express');
const router = express.Router();
const db = require('../../database/model.js');
const mongoose = require('mongoose');
const multer = require('multer');
const Web3 = require("web3");

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"));

const contractAddress = "0x74e10024267d84436820fBAB2d0d498fc94604E9";
const privateKey = "0xcd1f521f6b21c7fcf8a9e26cca0db5bc5c8b9a6bef485153fa04d6296719faca";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const address = account.address;

const contractAbi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_orderId",
                "type": "string"
            },
            {
                "name": "_state",
                "type": "uint256"
            }
        ],
        "name": "changeState",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_orderId",
                "type": "string"
            },
            {
                "name": "_temps",
                "type": "int64[]"
            }
        ],
        "name": "insertTemp",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_orderId",
                "type": "string"
            }
        ],
        "name": "getInfo",
        "outputs": [
            {
                "name": "",
                "type": "int64[]"
            },
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

console.log(address);

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
const contract = new web3.eth.Contract(contractAbi, contractAddress);

var User = mongoose.model('UserSchema', db.UserSchema);
var Product = mongoose.model('ProductSchema', db.ProductSchema);
var Cart = mongoose.model('CartSchema', db.CartSchema);
var Nutrient = mongoose.model('NutrientSchema', db.NutrientSchema);
var Order = mongoose.model('OrderSchema', db.OrderSchema);

router.put('/', function (req, res) {
    if (!"user1") {
        res.send({ 'status': false });
        console.log("no session");
        return;
    }

    User.findOne({ name: "user1" }, (err, user) => {
        if (!user) { res.send({ 'status': false }); return; }
        console.log(user);
        Cart.update({ _id: user.cart_id }, { $push: { product_id: req.body.product_id } }, (err, cart) => {
            console.log(cart);
            console.log(err);
            if (cart) {
                res.send({ 'status': true });
            } else {
                res.send({ 'status': false });
            }
        });
    });
});

router.get('/', (req, res) => {
    if (!"user1") {
        res.send({ 'status': false });
        console.log("no session");
        return;
    }

    User.findOne({ name: "user1" }, (err, user) => {
        if (!user) { res.send({ 'status': false }); return; }
        Cart.find({ _id: user.cart_id }, async (err, cart) => {
            console.log(cart);
            if (!cart) { res.send({ 'status': true }); return; }
            var products = cart[0].product_id
            var result = []
            for (var i = 0; i < products.length; i++) {
                console.log(products[i]);
                const product = await Product.findOne({ product_id: products[i]._id }); // , (err, product) => {
                result.push(product);
                if (result.length == products.length) {
                    res.send({ 'status': true, 'data': result });
                }
            }
        });
    });
});

router.get('/test', function (req, res) {
    Cart.find({ name: req.body.name }, (err, cart) => {
        console.log(cart);
    });
});

router.delete('/', function (req, res) {
    if (!"user1") {
        res.send({ 'status': false });
        console.log("no session");
        return;
    }

    User.findOne({ name: "user1" }, (err, user) => {
        if (!user) { res.send({ 'status': false }); return; }

        Cart.find({ name: "user1" }, (err, cart) => {
            Cart.collection.insert({ name: "user1" }, (err, new_cart) => {
                User.update({ name: "user1" }, { $set: { cart_id: new_cart.ops[0]._id } }, (err, user) => {
                    cart = cart[0]
                    Order.collection.insert({ state_id: "0", cart_id: cart._id }, (err, order) => {
                        if (!order) { res.send({ 'status': false }); return; }
                        console.log(order);
                        User.update({ name: "user1" }, { $push: { order_id: order.ops[0]._id.toString() } }, (err, user) => {
                            const data = contract.methods.changeState(order.ops[0]._id.toString(), 0).encodeABI();
                            const rawTx = {
                                nonce: web3.eth.getTransactionCount(address, 'pending'),
                                gasPrice: web3.utils.toHex(web3.utils.toWei("12", "gwei")),
                                gasLimit: web3.utils.toHex("210000"),
                                data,
                                from: address,
                                to: contractAddress,
                                value: web3.utils.toHex("0")
                            };
                            web3.eth.accounts.signTransaction(rawTx, privateKey).then(signedTransaction => {
                                web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

                            });
                        });

                        res.send({ 'status': true });
                        return;
                    });
                });
            });
        });
    });
});

const state = {}

router.post('/state', function (req, res) {
    const data = contract.methods.changeState(req.body.order_id.toString(), parseInt(req.body.state)).encodeABI();



    const rawTx = {
        nonce: web3.eth.getTransactionCount(address, 'pending'),
        gasPrice: web3.utils.toHex(web3.utils.toWei("12", "gwei")),
        gasLimit: web3.utils.toHex("210000"),
        data,
        from: address,
        to: contractAddress,
        value: web3.utils.toHex("0")
    };
    web3.eth.accounts.signTransaction(rawTx, privateKey).then(signedTransaction => {
        web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        Order.updateOne({ _id: req.body.order_id }, { state_id: req.body.state }, (err, orders) => {
            console.log("update", orders);
            state[req.body.order_id] = req.body.state;
            res.send({ 'status': true, 'state': req.body.state });
        });

    });

});

router.get('/order', function (req, res) {

    User.findOne({ name: "user1" }, (err, user) => {
        var orders = user.orders;
        var result = {};
        var state = {};
        for (var i = 0; i < orders.length; i++) {
            console.log("orders", orders[i]);
            Orders.findOne({ _id: orders[i] }, (err, order) => {
                cart_id = order.cart_id;
                var products = [];
                Cart.findOne({ _id: cart_id }, (err, cart) => {
                    products.append(cart.data);
                    result[orders[i]] = products;
                });
            })
        }
    });
    Order.find({}, (err, orders) => {
        res.send(orders);
    });
});


module.exports = router;
