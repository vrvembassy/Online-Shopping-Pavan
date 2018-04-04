'use strict';
 
const chai = require('chai');  
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('../server.js');

describe('Get Request (order)', function(){
    this.timeout(5000);
//valid request
    it('Should return a order',function(){
        return chai.request(app)
        .get('/admin/order/getOrderById/8')
        .then(function(res){
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
        })
    });
//invalid request
    it('Should return not found', function() {
        return chai.request(app)
          .get('/someOtherPath')
          .then(function(res) {
            throw new Error('Path exists!');
          })
          .catch(function(err) {
            expect(err).to.be.an('error');
          });
      });
});


describe('Post Request (Order)', function(){
    this.timeout(5000);
//valid request
    it('Should add new order', function() {
        return chai.request(app)
          .post('/admin/order/addOrder')
          .set("Content-Type", "application/json")
          .send({
            "cid": '10',
            "pstat":'XXXX',
            "ostat":'XXXXZZZZ'
          })
          .then(function(res){
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.be.an('object').that.have.key({orderid:'anything',status:'successfully added'});
          });
      });
//invalid request
      it('Should return bad request', function() {
        return chai.request(app)
          .post('/someOtherURL')
          .type('form')
          .send({
            color: 'YELLOW'
          })
          .then(function(res) {
            throw new Error('Invalid content type!');
          })
          .catch(function(err) {
            expect(err).to.be.an('error');
          });
      });
  });


describe('Delete request',function(){
    this.timeout(5000);
//delete the order
    it('Should cancel the order',function(){
      return chai.request(app)
    .post('/admin/order/addOrder')
    .set("Content-Type", "application/json")
        .send({
            "cid": '8',
            "pstat":'XXXX',
            "ostat":'XXXXZZZZ'
        })   
        .then(function(res){
            chai.request(app)
            .delete('/admin/order/delete/'+res.body.orderid)
            .then(function(res){
                expect(res).to.be.have.status(200);
                expect(res.body).to.be.an('object').that.have.key({status : "Successfully delete"});
            });
        });
    });
});


describe('Put request',function(){
    this.timeout(5000);
//modify the order
      it('Should modify',function(){
        return  chai.request(app)
        .post('/admin/order/addOrder')
        .set("Content-Type", "application/json")
        .send({
            "cid": '6',
            "pstat":'XXXX',
            "ostat":'XXXXZZZZ'
        })
        .then(function(res){
            chai.request(app)
            .put('/admin/order/modify/'+res.body.orderid)
            .set("Content-Type", "application/json")
            .send({
              "cid" : "6",
              "pstat":'YYYY',
              "ostat":'XXXXZZZZ'
            })
            .then(function(res){
               expect(res).to.be.have.status(200);
                expect(res.body).to.be.an('object').that.have.key({ status : "updated successfully" });
            })
        })
      })
  });
