var pg = require('pg');
let connectionParams = {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "online"
  }
 //add cart
  module.exports.add=function(status,jsondata,cb)
   {
    const con = new pg.Client(connectionParams);
    con.connect()
    if(status==null || status=='')
      {
          status="pending";
      }
    let query1="insert into checkout(status) values($1) RETURNING id";
    con.query(query1,[status],function(err,respnew){
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
      let checkout_id=respnew.rows[0].id;
      jsondata.map(function (person) {
      return con.query(new pg.Query(
        "insert into line_items(checkout_id,product_id, quantity) values('"+checkout_id+"','" + person.product_id + "', '" + person.quantity + "')"))
      }).pop().on('end', function () {
      con.end();
      cb(null,respnew.rows);
    })
  }
  })

}
 //view all the Entries in cart
  let query3 ="SELECT checkout.id, checkout.status, line_items.product_id, line_items.quantity FROM checkout INNER JOIN line_items ON line_items.checkout_id=checkout.id";
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
let query4 ="SELECT  line_items.id,checkout.status,line_items.product_id, line_items.quantity FROM checkout INNER JOIN line_items ON line_items.checkout_id=checkout.id WHERE checkout.id=$1";
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
  let query5 ="UPDATE checkout SET status=$2 WHERE checkout.id=$1";
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
          "UPDATE line_items SET product_id='"+person.product_id +"',quantity='"+person.quantity +"' WHERE line_items.checkout_id='"+id+"' AND line_items.id='"+person.id+"'"))
      }).pop().on('end', function () {
        
       con.end();
        cb(null,respnew.rows);
      
      })
    }
  })
}

 //Delete Entries in cart using id
  let delete_checkout ="DELETE FROM checkout WHERE checkout.id=$1";
  module.exports.delete_checkout=(id,cb)=>{
  const con = new pg.Client(connectionParams);
  con.connect();
  con.query(delete_checkout,[id],(err, respnew)=>{
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
      con.end();
      cb(null,respnew);
    }
  })
}