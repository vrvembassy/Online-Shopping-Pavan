'use strict';
 
const chai = require('chai');  
const expect = require('chai').expect;
 
chai.use(require('chai-http'));
 
const app = require('../server.js'); // Our app
 
describe('Test Cases', function() {  
  this.timeout(5000); // How long to wait for a response (ms)
 
  before(function() {
 
  });
 
  after(function() {
 
  });
 
  it('should return all orders in cart', function() {
    return chai.request(app)
      .get('/Cart/view_cart')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
      });
  });
  
  /*it('should return all orders in cart with id', function() {
    return chai.request(app)
      .get('/Cart/view_cart/id')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
      });
  });*/

  it('Add cart', function() {
    return chai.request(app)
      .get('/Cart/add_to_cart')
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });



  
  
})