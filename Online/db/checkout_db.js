var pg = require('pg');
let connectionParams = {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "online"
  }
 //add cart
  module.exports.add=function(jsondata,cb)
   {
    const con = new pg.Client(connectionParams);
    con.connect()
    
    var data;
    var total_price=new Array();
    var price;
    var pid;
    var status;
    if(status==null || status=='')
      {
          status="Completed";
      }
 for(let i=0;i<jsondata.length;i++)
 {
  var a=jsondata[i];
  query7="SELECT inventory.stock,product.price from inventory INNER JOIN product ON product.pdid= inventory.productid  WHERE inventory.productid=$1 AND inventory.stock>=$2";
  var res=con.query(query7,[a.productid,a.quantity],(err, respnew)=>{
    if(err)
    {
        if(cb)
        {
          cb(err,null);
          con.end();
          return;
        }
    }

    if(respnew.rows==null || respnew.rows=='')
    {
      cb(err,null);
          con.end();
          return;
    }
    if(cb && parseInt(i+1)==parseInt(jsondata.length))
    {
      price=parseInt(respnew.rows[0].price);
     
    query1="insert into checkout(status) values($1) RETURNING chkid";
      con.query(query1,[status],function(err,respnew){
      if(err)
      {
        if(cb)
          { 
            console.log(err);    
            cb(err,null);
            con.end();
            return;
          }
      }
      if(cb)
      {
       let checkout_id=respnew.rows[0].chkid;
         jsondata.map(function (person) {
        return con.query(new pg.Query(
          "insert into lineitems(checkoutid,productid,quantity,total_amount,pay_status) values('"+checkout_id+"','" + person.productid + "', '" + person.quantity + "', '" + person.quantity*price + "','paid') returning checkoutid"))
        }).pop().on('end', function () {
        cb(null,respnew.rows[0]);
        con.end();
      })
   }
  })
 }
})
}
}
  
 //view all the Entries in cart
  let query3 ="SELECT checkout.chkid, checkout.status, lineitems.productid, lineitems.quantity,lineitems.total_amount FROM checkout INNER JOIN lineitems ON lineitems.checkoutid=checkout.chkid";
  module.exports.view_cart=(cb)=>{
  const con = new pg.Client(connectionParams);
  try
  {
    con.connect();
  }
  catch(ex)
  {

  }
  con.query(query3,(err, respnew)=>{
    if(err)
    {
        if(cb)
        {
          cb(err,null);
          con.end();
          return;
        }
    }
    if(cb)
    {
     cb(null,respnew.rows)
     con.end();
    }
  })
}

 //view all the Entries in cart with id
let query4 ="SELECT  lineitems.lnitemid,checkout.status,lineitems.productid, lineitems.quantity FROM checkout INNER JOIN lineitems ON lineitems.checkoutid=checkout.chkid WHERE checkout.chkid=$1";
module.exports.get_line_items=(id,cb)=>{
  const con = new pg.Client(connectionParams);
  con.connect();
  con.query(query4,[id],(err, resp)=>{
    if(err)
    {
        if(cb)
        {
          
          cb(err,null);
          con.end();
          return;
        }
    }
    if(cb)
    {
     cb(null,resp.rows)
     con.end();
    }
  })

}


 //Update  Entries in cart using id
  let query5 ="UPDATE checkout SET status=$2 WHERE checkout.chkid=$1";
  module.exports.update_line_items=(id,update_value_array,cb)=>{
  const con = new pg.Client(connectionParams);
  con.connect()
  con.query(query5,[id,update_value_array[0].status],(err, respnew)=>{
    if(err)
    {
      if(cb)
        {
          cb(err,null);
          return;
        }
    }
    if(cb)
    {
      update_value_array.map(function (person) {
        return con.query(new pg.Query(
          "UPDATE lineitems SET quantity='"+person.quantity +"' WHERE lineitems.checkoutid='"+id+"' AND lineitems.lnitemid='"+person.lnitemid+"'returning checkoutid") )
      }).pop().on('end', function () {

        cb(null,respnew.rows);
        con.end();
      })
    }
  })
}

 //Delete Entries in cart using id
  var query8 ="DELETE FROM checkout WHERE checkout.chkid=$1";
  module.exports.delete_checkout=(id,cb)=>{
  const con = new pg.Client(connectionParams);
  con.connect();
  con.query(query8,[id],(err, respnew)=>{
    if(err)
    {
      if(cb)
        {
            console.log(err);
          cb(err,null);
          return;
        }
    }
    if(cb)
    {
      con.end();
      cb(null,respnew);
    }
  })
}