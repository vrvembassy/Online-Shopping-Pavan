'use strict'

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../server');

describe("Get all product from inventory",function() {
    this.timeout(5000);
    
    //test for valid request
    it('Display inventory',function() {
        return chai.request(app)
        .get('/admin/inventory/getStock')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
         });
    });

    //test case for invalid request   
    it('Get Invalid path',function() {
        return chai.request(app)
        .get('/somepath')
        .then(function() {
            throw new Error('page not found')
         })
         .catch(function(err) {
            expect(err).to.have.status(404);
         });
    });
});

//test case for post data to the server
describe('post request',function() {
    this.timeout(5000);
    //valid request
    it('store data to inventory',function() {
        return chai.request(app)
        .post('/admin/inventory/addInventory')
        .set('Content-Type','application/json')
        .send({
            "quantity" : "50",
            "productid" : "1"
        })
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.be.an('object').that.have.key({id:"anything",status : "success"});
        });
     }); 
    //invalid request
    it('invalid post request',function() {
        return chai.request(app)
        .post('/nopost/')
        .set('Content-Type','application/json')
        .send({
            "something" : "something"    
        })
        .then(function(res) {
           throw new Error('page not found');
        })
        .catch(function(err) {
            expect(err).to.have.status(404);
        });
    });
});

//modify the inventory
describe('Modify the inventory records',function() {
    this.timeout(5000);
    it('Post new data to the inventory',function() {
        return chai.request(app)
        .post('/admin/addStocks')
        .set('Content-Type','application/json')
        .send({
            "quantity" : "50",
            "productid" : "1"
        })
        .then(function(res) {
            chai.request(app)
            .get('/admin/modifyItemById/'+res.body.id)
            .then(function(res) {
                chai.request(app)
                .put('/admin/modifyItemById/'+res.body.stid+'?qty=35')
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.an('object').that.have.key({status : "success"});
                });
            }); 
        });     
    }); 
});

