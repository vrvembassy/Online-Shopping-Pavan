var express = require('express');
var app = express();

var product = require('./product/productController');
var inventory = require('./inventory/inventoryController');
var order = require('./order/orderController');
var checkout = require('./checkout/checkoutController');

app.use('/admin/products', product,(req,res,next)=>{
    res.status(200).send("Success");
});

app.use('/admin/inventory', inventory,(req,res,next)=>{
    res.status(200).send("Success");
});

app.use('/admin/order', order,(req,res,next)=>{
    res.status(200).send("Success");
});

app.use('/admin/cart', checkout,(req,res,next)=>{
    res.status(200).send("Success");
});
module.exports = app;