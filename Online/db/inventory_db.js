var pg = require('pg');
//conect to postgres 
let connectionParams = {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "online"
  }

//add inventory
module.exports.addInventory = function(quantity,productid,cb){
      const con = new pg.Client(connectionParams);
      con.connect();
      query1 = "insert into inventory(stock,productid) values($1,$2) returning stid as invid";
      con.query(query1,[quantity,productid],(err,resp)=>{
         if(err){
          
            if(cb) cb(err,null);
            con.end();
            return;
         }
         if(cb)
         cb(null,resp.rows[0].invid); 
         con.end();
      });
  }

//access inventory details
module.exports.fetchStockDetails = function(cb) {
    const conn = new pg.Client(connectionParams)
    conn.connect();
    let query1  = "select name,stock,sku from inventory i,product p where p.pdid=i.productid";
    conn.query(query1,(err,resp) =>{
        if(err) {
            if(cb) {
                cb(err,null);
                con.end();
                return;
            }
        }
        if(cb)
        cb(null,resp.rows);
        conn.end();
    })
}

//access inventory by id
module.exports.getItemById = function(sid,cb) {
    const conn = new pg.Client(connectionParams)
    conn.connect();
    let query1 = "select productid,name,stock,sku from inventory i,product p where stid=$1 AND  p.pdid=i.productid";
    conn.query(query1,[sid],(err,resp) => {
        if(err) {
            if(cb) {
                cb(err,null);
                return;
            }
        }
        if(cb) {
            //console.log(resp);
            cb(null,resp.rows[0]);
        
        }
        conn.end();
    });
}

//modify inventory
module.exports.updateQuantity = function(id,qty,cb){
    const con = new pg.Client(connectionParams);
    con.connect();
    query8 = "SELECT stock from inventory where productid=$1";
    con.query(query8,[id],(err,resp)=>{
        if(err){
            if(cb) cb(err,null);
            con.end();
            return;
        }
        cur_quantity = parseInt(resp.rows[0].stock);
        qty = parseInt(qty);
        ans = cur_quantity+(qty);
        if(ans>0){
            query7 = "UPDATE inventory SET stock=$1 where productid=$2";
            con.query(query7,[ans,id],(err1,resp1)=>{
                if(err1){
                    if(cb) cb(err,null);
                    con.end();
                    return;
                }
                if(cb)
                cb(null,resp1);
                con.end();
            });
        }  
        else {
            cb(err,null);
            con.end();
            return;
        }         
    });
}
