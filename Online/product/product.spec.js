'use strict';
 
const chai = require('chai');  
const expect = require('chai').expect;
 
chai.use(require('chai-http'));
 
const app = require('../server.js'); // Our app
 
describe('Get Request', function() {  
this.timeout(5000); // How long to wait for a response (ms)
        // GET - List all products
    it('should return all products', function() {
        return chai.request(app)
        .get('/admin/products/viewproducts')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
        });
    });

// GET - Invalid path
    it('should return Not Found', function() {
        return chai.request(app)
        .get('/INVALID_PATH')
        .then(function(res) {
            throw new Error('Invalid path!');
        })
        .catch(function(err) {
            expect(err).to.have.status(404);
        });
    });
});


describe('Post request', function(){
    this.timeout(5000); // How long to wait for a response (ms)
    // POST - Add new products
    it('should add new products', function() {
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
            expect(res.body).to.be.an('object').that.have.key({id:"someid",status:'success'});
        });
    });
    // POST - Bad Request
    it('should return Bad Request', function() {
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
            expect(err).to.have.status(500);
        });
    });
});

//delete product
describe('Delete Request',function(){
    this.timeout(5000); // How long to wait for a response (ms)
    it('it should delete the item',function(){
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
            console.log(res.body);
            chai.request(app)
            .delete('/admin/products/delete'+res.body.id)
            .then(function(res){
                console.log(res.body);
                expect(res).to.be.have.status(200);
                expect(res.body).to.be.an('object').that.have.key({status:"Deleted successfully"});
            });
        });
    });
});
/*
//modify product
describe('Put Request',function(){
    this.timeout(5000); // How long to wait for a response (ms)
    it('should modify',function(){
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
            .get('/admin/products/modify/'+res.body.id)
            .then(function(res){ 
                chai.request(app)
                .put('/admin/products/modify/'+res.body.id)
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
});*/
