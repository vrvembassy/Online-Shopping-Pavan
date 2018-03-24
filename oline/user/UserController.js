var express = require('express');
var router=express();
var bodyParser=require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var db=require('../db');

router.post('/add_to_cart',(req,res)=>
{
    var status=req.body.status;
    var jsondata=req.body;
        db.add(status,jsondata,(err,resp)=>{
         
                if(err)
                {
                    return res.status(500).send("oops");
        
                }
                if(!resp)
                {
                    return res.status(404).send("not found");
                }
                res.status(200).send("successfully inserted");
        })

    
})

router.get('/view_cart', (err,res)=>{
db.view_cart((err1,respnew)=>{
    if(err1)
    {
        return res.status(500).send("oops");

    }
    if(!respnew)
    {
        return res.status(404).send("not found");
    }
    if(respnew)
    {
        if(respnew.length==0)
            {
                return res.status(200).send("No Entries Found"); 
            }
    else
    {
    return res.status(200).send(respnew);
    }
    }
        
    })
})


router.get("/view_cart/:id",(req,res)=>{
   
    let id=req.params.id;
    let status=req.body.status;
    let product_id=req.body.product_id;
    let quantity=req.body.quantity;
    console.log(id);
    db.get_line_items(id,(err,resp)=>{
        if(err)
        {
            return res.status(500).send("oops");
    
        }
        if(!resp)
        {
            return res.status(404).send("not found");
        }
          //res.status(200).send("success");
         if(resp)
        {
            if(resp.length==0)
            {
                return res.status(200).send("Id Not Found"); 
            }
            else
            {
                return res.status(200).send(resp);
            }
           
        } 
          
        })
})

router.put("/update_cart/:id",(req,res)=>{
    let id=req.params.id;
     update_value_array=req.body;
    db.update_line_items(id,update_value_array,(err,respnew)=>{
        if(err)
        {
            return res.status(500).send("oops");
    
        }
        if(!respnew)
        {
            return res.status(404).send("not found");
        }
         if(respnew)
         {
            return res.status(200).send("Successfully Updated");
         } 
          
        })
})

router.delete("/delete_cart/:id",(req,res)=>{
    let id=req.params.id;
    db.delete_checkout(id,(err,respnew)=>{
        if(err)
        {
            return res.status(500).send("oops");
    
        }
        if(!respnew)
        {
            return res.status(404).send("not found");
        }
         if(respnew)
        {
            return res.status(200).send("Successfully deleted");
        } 
          
        })
})

module.exports = router;