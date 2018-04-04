var pg = require('pg');
//conect to postgres 
let connectionParams = {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "online"
}

//add products
module.exports.addProducts= function(name,price,description,sku,cb){
    const con = new pg.Client(connectionParams);
    con.connect();
    $query1 = "INSERT into product (name,price,description,sku) values ($1,$2,$3,$4) returning pdid as pdtid";
    con.query($query1,[name,price,description,sku],(err,res)=>{
        if(err){
           console.log(err);
            if(cb) cb(err,null);
            con.end();
            return;
        }
        if(cb)
        cb(null,res.rows[0].pdtid);
    });
}

 //access products
module.exports.FetchProducts = function(cb)
{
    const con = new pg.Client(connectionParams);
    con.connect();
    query2 = "SELECT name,price,description,sku FROM product";
    con.query(query2,(err,res)=>{
        if(err){
            if(cb) cb(err,null);
            con.end();
            return;
        }

        if(cb) cb(null,res);
        con.end();
    });
}

//access product by using id
module.exports.FetchById = function(id,cb){
    const con = new pg.Client(connectionParams);
    con.connect();
    query3 = "SELECT pdid,name,price,description,sku FROM product where pdid=$1"
    con.query(query3,[id],(err,res)=>{
        if(err){
            if(cb) cb(err,null);
            con.end();
            return;
        }
        if(cb) cb(null,res.rows[0]);
        con.end();       
    });
}

//modify products
module.exports.ModifyProducts = function(name,price,description,sku,id,cb) {
    const con = new pg.Client(connectionParams);
    con.connect();
    query4 = "UPDATE product SET name=$1,price=$2,description=$3,sku=$4 where pdid=$5";
    con.query(query4,[name,price,description,sku,id],(err,resp)=>{
        if(err){
            if(cb) cb(err,null);
            con.end();
            return;
        }
        if(cb)
        cb(null,resp);
        con.end();
    });
}

//delete products
module.exports.deleteProduct = function(id,cb){
    const con = new pg.Client(connectionParams);
    con.connect();
    query5 = "DELETE from product where pdid=$1";
    con.query(query5,[id],(err,res)=>{
        if(err){
            if(cb) cb(err,null);
            return;
        }
        if(cb) cb(null,res);
        con.end();
    });
}
