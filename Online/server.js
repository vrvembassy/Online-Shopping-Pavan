var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var api = require('/app');

var app = express();



app.use(logger(app.get("env") === "production" ? "combined" : "dev"));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.use('/', api);




app.set("env", process.env.NODE_ENV || "development");
app.set("host", process.env.HOST || "0.0.0.0");
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function () {
    console.log('\n' + '**********************************');
    console.log('REST API listening on port ' + app.get("port"));
    console.log('**********************************' + '\n');
});



app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status( err.code || 500 )
        .json({
            status: 'error',
            message: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    .json({
        status: 'error',
        message: err.message
    });
});


module.exports = app;

