var pg = require('pg');
//conect to postgres 
let connectionParams = {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "online"
}

//insert orders details
module.exports.addOrders = function(cid,pstat,ostat,cb){
    const con = new pg.Client(connectionParams);
    con.connect();
    query1 = "INSERT INTO orders(chkoutid, pstatus, ostatus) values($1, $2, $3) returning orderid";
    con.query(query1,[cid,pstat,ostat],(err,resp)=>{
        if(err){

            if(cb) cb(err,null);
            con.end();
            return;
        }
        if(cb) cb(null, resp.rows[0].orderid);  
        con.end();
    });
}

//fetch order details
module.exports.getOrder = function(id,cb){
    const con = new pg.Client(connectionParams);
    con.connect();
    query2 = "SELECT * FROM orders WHERE orderid=$1";
    con.query(query2,[id],(err,resp)=>{
        if(err){
            if(cb) cb(err,null);
            con.end();
            return;
        }
        if(cb) cb(null,resp.rows[0]);
        con.end();
    });
}

//update order details
module.exports.modifyOrder = function(cid, pstat, ostat, id, cb){
    const con = new pg.Client(connectionParams);
    con.connect();
    query3 = "UPDATE orders set  pstatus=$1, ostatus=$2 WHERE chkoutid=$3 returning chkoutid";
        con.query(query3,[pstat,ostat,cid],(err,resp1)=>{
            if(err){
                con.end();  
                return;
            }
            let chkoutid = resp1.rows[0].chkoutid;
            if(pstat=="paid"){
                query36 = "SELECT productid,quantity from lineitems WHERE checkoutid=$1";
                con.query(query36,[chkoutid],(err,resp6)=>{
                    if(err){
 
                        if(cb) cb(err,null);
                        con.end();
                        return;
                    }
                    console.log(resp6.rows[0]);
                    const productid = resp6.rows[0].productid;
                    const quantity = parseInt(resp6.rows[0].quantity);
                    console.log(quantity); 
                    query34 = "SELECT stock from inventory WHERE productid=$1";
                    con.query(query34,[productid],(err,resp4)=>{
                        if(err){
                            if(cb) cb(err,null);
                            con.end();
                            return;
                        }
                        let stock = parseInt(resp4.rows[0].stock);
                        console.log(stock);
                        stock = stock - quantity;
                        console.log(stock);
                        query35 = "UPDATE inventory set stock=$1 WHERE productid=$2";
                        con.query(query35,[stock,productid],(err,resp5)=>{
                            if(err){
                                console.log(err);
                                if(cb) cb(err,null);
                                con.end();
                                return;
                            }
                            query32 = "UPDATE lineitems SET pay_status=$1 WHERE checkoutid = $2";
                            con.query(query32,[pstat,cid],(err,resp2)=>{
                                if(err){
                                    console.log(err);
                                    if(cb) cb(err,null);
                                    con.end();
                                    return;
                                }
                                if(cb) cb(null,resp2);
                                con.end();
                            });
                        });
                    });
                });
            }   
        });
}

//delete order details
module.exports.deleteOrder = function(id,cb){
    const con = new pg.Client(connectionParams);
    con.connect();
    query4 = "DELETE FROM orders WHERE orderid=$1";
    con.query(query4,[id],(err,resp)=>{
        if(err){
            if(cb) cb(err,null);
            con.end();  
            return;
        }
        if(cb) cb(null,resp);
        con.end();
    })
}