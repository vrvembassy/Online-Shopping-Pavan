var express = require('express');
var app = express();
var db = require('./db');
var UserController = require('./user/UserController');
app.use('/Cart', UserController,(req, res, next)=>{
    res.status(200).send("success");
});
module.exports = app;