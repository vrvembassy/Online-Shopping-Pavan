'use strict';
 
const chai = require('chai');  
const expect = require('chai').expect;
 
chai.use(require('chai-http'));
 
const app = require('../server.js'); // Our app
 
describe('Get Request(products)', function() {  
this.timeout(5000); // How long to wait for a response (ms)
        // GET - List all products
    it('should return all products (products)', function() {
        return chai.request(app)
        .get('/admin/products/viewproducts')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
        });
    });


    // GET - Invalid path
    it('should return Not Found (products)', function() {
        return chai.request(app)
        .get('/admin/product/viewproducts')
        .then(function(res) {
            throw new Error('Invalid path!');
        })
        .catch(function(err) {
            expect(err).to.be.an('error');
        });
    });
});


describe('Post request(products)', function(){
    this.timeout(5000); // How long to wait for a response (ms)
    // POST - Add new products
    it('should add new products (products)', function() {
        return chai.request(app)
        .post('/admin/products/addProduct')
        .set("Content-Type", "application/json")
        .send({
            "name": 'park avenue',
            "price":'1020.00',
            "description":'It is good t-shirt',
            "sku":'TSHIRTPARED'
        })
        .then(function(res){
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.be.an('object').that.have.key({productid:"someid",status:'success'});
        });
    });
    // POST - Bad Request
    it('should return Bad Request (products)', function() {
        return chai.request(app)
        .post('/admin/products')
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


//delete product
describe('Delete Request (products)',function(){
    this.timeout(5000); // How long to wait for a response (ms)
    it('it should delete the item (products)',function(){
        return chai.request(app)
        .post('/admin/products/addProduct')
        .set("Content-Type", "application/json")
        .send({
            "name": 'park avenue',
            "price":'1020.00',
            "description":'It is good t-shirt',
            "sku":'TSHIRTPARED'
        })   
        .then(function(res){
            chai.request(app)
            .delete('/admin/products/delete/'+res.body.productid)
            .then(function(res){
                expect(res).to.be.have.status(200);
                expect(res.body).to.be.an('object').that.have.key({status:"Deleted successfully"});
            });
        });
    });
});

//modify product
describe('Put Request (products)',function(){
    this.timeout(5000); // How long to wait for a response (ms)
    it('should modify (products)',function(){
        return  chai.request(app)
        .post('/admin/products/addProduct')
        .set("Content-Type", "application/json")
        .send({
            "name" : "nike",
            "price" : "999.99",
            "description" : "It is good quality shoes",
            "sku" : "NIKESHOESWHITE"
        })
        .then(function(res){
            chai.request(app)
            .get('/admin/products/viewproducts/'+res.body.productid)
            .then(function(res1){ 
                chai.request(app)
                .put('/admin/products/modify/'+res1.body.pdid)
                .set("Content-Type", "application/json")
                .send({
                    "name" : "Puma",
                    "price" : "999.99",
                    "description" : "It is good quality shoes",
                    "sku" : "NIKESHOESWHITE"
                })
                .then(function(res){
                    expect(res).to.be.have.status(200);
                    expect(res.body).to.be.an('object').that.have.key({status:"success"});
                })
            })      
        })
    })
});