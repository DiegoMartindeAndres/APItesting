const expect = require('chai').expect;
let chaiHttp = require('chai-http');
let chai = require('chai');
var fs = require('file-system');
var crypto = require('crypto');
var config = require('../../config/config');

chai.use(chaiHttp);
const url = "https://test.api.nodalblock.com/v2/es";

//Parametros
var apiKey = config.apiKey;
var path = __dirname;
var apiKeyError = "123";

function createHash() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
    return hash;
  }

describe("Registering hash of document...", function () {

    describe("Register hash with no hash parameter", function () {
      it("Should be an error because of lack of hash", function (done) {
        chai.request(url)
        .post('/hash')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('type', 'required');
          done();
        });
      });
    });
    describe("Register hash with wrong api key", function () {
        it("Should be an error because of wrong api key", function (done) {
            var hash = '0137567e14cc852fb637116a093aef145fc5e1bda3e6513f2c9ad258f0e381c0' // hash de file ya subido,de test.pdf
          chai.request(url)
          .post('/hash')
          .type('form')
          .set('accept', 'application/json')
          .set('apiKey', apiKeyError)
          .field('hash',hash)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('type','invalid');
            done();
          });
        });
      });
      describe("Register hash correctly", function () {
        it("Should return info", function (done) {
        var hash = '0137567e14cc852fb637116a093aef145fc5e1bda3e6513f2c9ad258f0e381c0' // hash de file ya subido,de test.pdf
          chai.request(url)
          .post('/hash')
          .type('form')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .field('hash',hash)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            done();
            fs.writeFile(path + '/registerHash.json', JSON.stringify(res.body), function (err) {
                if (err) console.log(err);
              });
          });
        });
      });
      describe("Register incorrect hash", function () {
        it("Should return error", function (done) {
        var hash = 'sajgafs6a5f8af' // hash de file ya subido,de test.pdf
          chai.request(url)
          .post('/hash')
          .type('form')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .field('hash',hash)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(400);
            done();
          });
        });
      });
});

describe("Get hash certificate of document...", function () {
    describe("Get hash certificate with no hash parameter", function () {
      it("Should be an error because of lack of hash", function (done) {
          var hash = null;
        chai.request(url)
        .get('/hash/'+hash+'/certificate')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
      });
    });
    describe("Get hash certificate with wrong api key", function () {
        it("Should be an error because of wrong api key", function (done) {
         var hash = '0137567e14cc852fb637116a093aef145fc5e1bda3e6513f2c9ad258f0e381c0' // hash de file ya subido,de test.pdf
          chai.request(url)
          .get('/hash/'+hash+'/certificate')
          .set('accept', 'application/json')
          .set('apiKey', apiKeyError)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('type','invalid');
            done();
          });
        });
      });
      describe("Get hash certificate correctly", function () {
        it("Should return info", function (done) {
        var hash = '0137567e14cc852fb637116a093aef145fc5e1bda3e6513f2c9ad258f0e381c0' // hash de file ya subido,de test.pdf
          chai.request(url)
          .get('/hash/'+hash+'/certificate')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            done();
            fs.writeFile(path + '/getHashCertificate.json', JSON.stringify(res.body), function (err) {
                if (err) console.log(err);
              });
          });
        });
      });
      describe("Get certificate from incorrect hash", function () {
        it("Should return error", function (done) {
        var hash = 'sajgafs6a5f8af' 
          chai.request(url)
          .get('/hash/'+hash+'/certificate')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .field('hash',hash)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('type','invalid');
            done();
          });
        });
      });
});


describe("Getting hash certificate info of document...", function () {
    describe("Get hash certificate info with no hash parameter", function () {
      it("Should be an error because of lack of hash", function (done) {
          var hash = null;
        chai.request(url)
        .get('/hash/'+hash+'/infocertificate')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
      });
    });
    describe("Get hash certificate info with wrong api key", function () {
        it("Should be an error because of wrong api key", function (done) {
         var hash = '0137567e14cc852fb637116a093aef145fc5e1bda3e6513f2c9ad258f0e381c0' // hash de file ya subido,de test.pdf
          chai.request(url)
          .get('/hash/'+hash+'/infocertificate')
          .set('accept', 'application/json')
          .set('apiKey', apiKeyError)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('type','invalid');
            done();
          });
        });
      });
      describe("Get hash certificate info correctly", function () {
        it("Should return info", function (done) {
        var hash = '0137567e14cc852fb637116a093aef145fc5e1bda3e6513f2c9ad258f0e381c0' // hash de file ya subido,de test.pdf
          chai.request(url)
          .get('/hash/'+hash+'/infocertificate')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            done();
            fs.writeFile(path + '/getHashCertificateInfo.json', JSON.stringify(res.body), function (err) {
                if (err) console.log(err);
              });
          });
        });
      });
      describe("Get certificate info from incorrect hash", function () {
        it("Should return error", function (done) {
        var hash = 'sajgafs6a5f8af' 
          chai.request(url)
          .get('/hash/'+hash+'/infocertificate')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .field('hash',hash)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('type','invalid');
            done();
          });
        });
      });
});