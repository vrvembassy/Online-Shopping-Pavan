var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var NATS = require('nats');
//var servers = ['http://localhost:8222'];
//var nats = NATS.connect({'servers': servers});
var nats = NATS.connect();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//inventory database
var db = require('../db/inventory_db');

//add inventory for product
router.post('/addInventory',(req,res)=>{
  /*  nats.subscribe('events',function(msg){
        console.log(msg);
    })*/
   // if(nats.subscribe('events') == true){
        let quantity = req.body.quantity;
        let productid = req.body.productid;
        db.addInventory(quantity,productid,(err,resp)=>{
            if(err) return res.status(500).send('Error in server');
            if(!resp) return res.status(404).send('Can\'t add to inventory');
            res.status(200).send({inventoryid:resp,status:'success'});
        });
  //  }
  ///  else{
  //      console.log('cannot insert product inventory');
  //  }
});

//get all stacks
router.get('/getStock',(req,res) => {
    db.fetchStockDetails((err,resp) =>{
        if(err) return  res.status(500).send("oops..!something went wrong");
        if(!resp) {
           return res.status(404).send("page not found");
        }
        return res.status(200).send({items:resp});
    });   
})

//get stock by id
router.get('/getItemStock/:id',(req,res) => {
    let stkid = req.params.id;
    db.getItemById(stkid,(err,resp) =>{
        if(err) return res.status(500).send("oops..!something went wrong");
        if(!resp) return res.status(404).send("page not found");
        res.status(200).send({items:resp});
    })
})

//Modify inventory
router.put('/modify/:id/',(req,res)=>{
    let id = req.params.id;
    let qty = req.query.qty;
    db.updateQuantity(id,qty,(err,resp)=>{
        if(err) return res.status(500).send('Error on the server');
        if(!resp) return res.status(404).send('Can\'t update');
        res.status(200).send({status:"Updated successfully"}); 
    })
});


module.exports =router;