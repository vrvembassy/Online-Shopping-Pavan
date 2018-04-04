'use strict';
 
const chai = require('chai');  
const expect = require('chai').expect;
 
chai.use(require('chai-http'));
 
const app = require('../server.js'); // Our app
 
describe('Test Cases (checkout)', function() {  
  //this.timeout(5000); // How long to wait for a response (ms)

    it('should return all orders in cart', function() {
        return chai.request(app)
        .get('/admin/cart/view_cart')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('array');
        });
    });

    it('Add cart', function() {
        return chai.request(app)
        .post('/admin/cart/add_to_cart')
        .set('Content-Type','application/json')
        .send([{
            "productid" : "2",
            "quantity" : "3"
        }])
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object').that.have.key({id:'something',status:"successfully inserted"});
        });
    });

    it('should delete the cart',function(){
        return chai.request(app)
        .post('/admin/cart/add_to_cart')
        .set('Content-Type','application/json')
        .send([{
            "productid" : "2",
            "quantity" : "5"
        }])
        .then(function(res) {
            chai.request(app)
            .delete('/admin/cart/delete_cart/'+res.body.id)
            .then(function(res){
                expect(res).to.be.have.status(200);
                expect(res.body).to.be.an('object').that.have.key({status:"Deleted successfully"});
            });
        });
    });

    it('should update the cart',function(){
        return chai.request(app)
        .post('/admin/cart/add_to_cart')
        .set('Content-Type','application/json')
        .send([{
            "productid" : "2",
            "quantity" : "5"
        }])
        .then(function(res){
            chai.request(app)
            .put('/admin/cart/update_cart/'+res.body.id)
        })
    })
});

  
