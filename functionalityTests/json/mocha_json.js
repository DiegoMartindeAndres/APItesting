const expect = require('chai').expect;
let chaiHttp = require('chai-http');
let chai = require('chai');
var fs = require('fs');
var config = require('../../config');

chai.use(chaiHttp);
const url = "https://test.api.nodalblock.com/v2/es";

//Parametros
var apiKey = config.apiKey;
var path = __dirname;
var apiKeyError = "123";
var formData ={name:"pepe",surname:"perez"};


describe("Uploading json...", function () {

    describe("Register without json", function () {
      it("Should be an error because of lack of json data", function (done) {
        chai.request(url)
        .post('/json')
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
    describe("Register json with wrong api key", function () {
        it("Should be an error because of wrong api key", function (done) {
          chai.request(url)
          .post('/json')
          .type('form')
          .set('accept', 'application/json')
          .set('apiKey', apiKeyError)
          .field('json', JSON.stringify(formData))
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('type', 'invalid');
            done();
          });
        });
      });
      describe("Register json correctly", function () {
        it("Should return true", function (done) {
          chai.request(url)
          .post('/json')
          .type('form')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .field('json', JSON.stringify(formData))
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(200); //deberia ser 201 creo
            fs.writeFile(path + '/registerJson.json', JSON.stringify(res.body), function (err) {
                if (err) console.log(err);
              });
            done();
          });
        });
      });
});

describe("Getting certificate of json...", function () {
    describe("Get certificate with no txhash parameter", function () {
      it("Should be an error because of lack of tx_hash", function (done) {
        var txhash = null;
        chai.request(url)
        .get('/json/'+txhash+'/certificate')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
      });
    });
    describe("Get json certificate with wrong api key", function () {
        it("Should be an error because of wrong api key", function (done) {
            var contents = fs.readFileSync(path + '/registerJson.json'); // o signedFileUploaded.json
            var jsonContent = JSON.parse(contents);
            var txhash = jsonContent.tx_hash;        
            chai.request(url)
          .get('/json/'+txhash+'/certificate')
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
      describe("Get json certificate correctly", function () {
        it("Should return info", function (done) {
            var contents = fs.readFileSync(path + '/registerJson.json'); // o signedFileUploaded.json
            var jsonContent = JSON.parse(contents);
            var txhash = jsonContent.tx_hash;
        chai.request(url)
          .get('/json/'+txhash+'/certificate')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            done();
            fs.writeFile(path + '/getJsonCertificate.json', JSON.stringify(res.body), function (err) {
                if (err) console.log(err);
              });
          });
        });
      });
      describe("Get certificate from incorrect txhash", function () {
        it("Should return error", function (done) {
        var txhash = 'sajgafs6a5f8af' ;
          chai.request(url)
          .get('/json/'+txhash+'/certificate')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('type','invalid');
            done();
          });
        });
      });
});


describe("Getting json certificate info of document...", function () {
    describe("Get json certificate info with no txhash parameter", function () {
      it("Should be an error because of lack of hash", function (done) {
        var txhash = null;
        chai.request(url)
        .get('/json/'+txhash+'/infocertificate')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(500);
          done();
        });
      });
    });
    describe("Get json certificate info with wrong api key", function () {
        it("Should be an error because of wrong api key", function (done) {
            var contents = fs.readFileSync(path + '/registerJson.json'); // o signedFileUploaded.json
            var jsonContent = JSON.parse(contents);
            var txhash = jsonContent.tx_hash;
         chai.request(url)
          .get('/hash/'+txhash+'/infocertificate')
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
      describe("Get json certificate info correctly", function () {
        it("Should return info", function (done) {
            var contents = fs.readFileSync(path + '/registerJson.json'); // o signedFileUploaded.json
            var jsonContent = JSON.parse(contents);
            var txhash = jsonContent.tx_hash;
         chai.request(url)
          .get('/json/'+txhash+'/infocertificate')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            done();
            fs.writeFile(path + '/getJsonCertificateInfo.json', JSON.stringify(res.body), function (err) {
                if (err) console.log(err);
              });
          });
        });
      });
      describe("Get certificate info from incorrect txhash", function () {
        it("Should return error", function (done) {
        var txhash = 'sajgafs6a5f8afewtgewffwef';
          chai.request(url)
          .get('/json/'+txhash+'/infocertificate')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(500);
            done();
          });
        });
      });
});