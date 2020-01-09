
const expect = require('chai').expect;
let chaiHttp = require('chai-http');
let chai = require('chai');
var fs = require('file-system');
var config = require('../../config');

chai.use(chaiHttp);
const url = "https://test.api.nodalblock.com/v2/es";

//Parametros
var apiKey = config.apiKey;
var path = __dirname;
var apiKeyError = "123";


var blockchain_type_1 = 'by_contract';
var blockchain_type_2 = 'by_signer';
var number_signatories = 1;
var user_tx_hash = '0xffd16fac32b7567d229f29c7201ca43d61c1bf4eb642d3b95a10c43e6e218317';
var user_hash = 'f09753c2166b025f6656faf15a9e5579bb0d413504b5a5ee13fb8055c0b2ecb3';
var file_hash = '0137567e14cc852fb637116a093aef145fc5e1bda3e6513f2c9ad258f0e381c0';

//CREATE CONTRACT
describe("Creating a contract...", function () {
  describe("Create a contract with wrong api key", function () {
    it("Should be an error because of wrong api key", function (done) {
      var file = path + '/test.pdf';
      var contract_id = Math.random().toString();
      chai.request(url)
        .post('/contracts')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .field('contract_id', contract_id)
        .field('blockchain_type', blockchain_type_1)
        .field('number_signatories', number_signatories)
        .attach('contract', fs.readFileSync(file), 'test.pdf')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Create a contract without some parameters", function () {
    it("Should be an error because of parameter required", function (done) {
      var file = path + '/test.pdf';
      var contract_id = Math.random().toString();
      chai.request(url)
        .post('/contracts')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('blockchain_type', blockchain_type_1)
        .field('number_signatories', number_signatories)
        .attach('contract', fs.readFileSync(file), 'test.pdf')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Create a contract with 'One by transaction' option", function () {
    it("Should return info", function (done) {
      var file = path + '/test.pdf';
      var contract_id = Math.random().toString();
      chai.request(url)
        .post('/contracts')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('contract_id', contract_id)
        .field('blockchain_type', blockchain_type_1)
        .field('number_signatories', number_signatories)
        .attach('contract', fs.readFileSync(file), 'test.pdf')
        .end(function (err, res) { // falta añadir que expect mas propiedades, falta informacion sobre contract
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          done();
          fs.writeFile(path + '/createdContract1.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          });
        });
    });
  });
  describe("Create a contract with 'One by signer' option", function () {
    it("Should return info", function (done) {
      var file = path + '/test.pdf';
      var contract_id = Math.random().toString();
      chai.request(url)
        .post('/contracts')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('contract_id', contract_id)
        .field('blockchain_type', blockchain_type_2)
        .field('number_signatories', number_signatories)
        .attach('contract', fs.readFileSync(file), 'test.pdf')
        .end(function (err, res) { // falta añadir que expect mas propiedades, falta informacion sobre contract
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          done();
          fs.writeFile(path + '/createdContract2.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          });
        });
    });
  });
});

// SIGN A CONTRACT
describe("Signing a contract...", function () {
  describe("Sign a contract with wrong api key", function () {
    it("Should be an error because of wrong api key", function (done) {
      var contents = fs.readFileSync(path + '/createdContract1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .post('/contracts/' + contract_id)
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .field('contract_id', contract_id)
        .field('user_tx_hash', user_tx_hash) // o .field('user_hash',user_hash)
        .field('user_name', 'pepe')
        .field('user_surname', 'perez')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Signing a contract without some parameters", function () {
    it("Should be an error because of parameter required", function (done) {
      var contents = fs.readFileSync(path + '/createdContract1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .post('/contracts/' + contract_id)
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .field('contract_id', contract_id)
        .field('user_name', 'pepe')
        .field('user_surname', 'perez')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Signing a contract with the user tx_hash", function () {
    it("Should return info", function (done) {
      var contents = fs.readFileSync(path + '/createdContract1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .post('/contracts/' + contract_id)
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('contract_id', contract_id)
        .field('user_tx_hash', user_tx_hash)
        .field('user_name', 'pepe')
        .field('user_surname', 'perez')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          done();
          /* fs.writeFile(path + '/signedContractTxhash.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          }); */
        });
    });
  });
  describe("Signing a contract with the hash of digital img", function () {
    it("Should return info", function (done) {
      var contents = fs.readFileSync(path + '/createdContract1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .post('/contracts/' + contract_id)
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('contract_id', contract_id)
        .field('user_hash', user_hash)
        .field('user_name', 'pepe')
        .field('user_surname', 'perez')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          done();
          /* fs.writeFile(path + '/signedContractImgHash.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          }); */
        });
    });
  });
});

//GET CONTRACT FILE
describe("Getting a contract...", function () {
  describe("Get a contract with wrong api key", function () {
    it("Should be an error because of wrong api key", function (done) {
      var contents = fs.readFileSync(path + '/createdContract1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .get('/contracts/' + contract_id)
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  // y si pruebo tambien id que no exista...
  describe("Get a contract with no contract_id", function () {
    it("Should be an error because of no contract id", function (done) {
     var contract_id = null;
      chai.request(url)
        .get('/contracts/' + contract_id)
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(404);
          done();
        });
    });
  });
  describe("Get a contract correctly", function () {
    it("Should return the contract info", function (done) {
      var contents = fs.readFileSync(path + '/createdContract1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .get('/contracts/' + contract_id)
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          done();
         /*  fs.writeFile(path + '/getContract.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          }); */
        });
    });
  });
});

//GET CONTRACT CERTIFICATE
describe("Getting a contract certificate...", function () {
  describe("Get a contract certificate with wrong api key", function () {
    it("Should be an error because of wrong api key", function (done) {
      var contents = fs.readFileSync(path + '/createdContract1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .get('/contracts/' + contract_id+'/certificate')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Get a contract certificate with no contract_id", function () {
    it("Should be an error because of no contract id", function (done) {
     var contract_id = null;
      chai.request(url)
        .get('/contracts/' + contract_id+'/certificate')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(404);
          done();
        });
    });
  });
  describe("Get a contract certificate correctly", function () {
    it("Should return the contract info", function (done) {
      var contents = fs.readFileSync(path + '/createdContract1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .get('/contracts/' + contract_id+'/certificate')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          done();
          /* fs.writeFile(path + '/getContractCertificate.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          }); */
        });
    });
  });
});

//GET CONTRACT CERTIFICATE INFO
describe("Getting a contract certificate info...", function () {
  describe("Get a contract certificate with wrong api key", function () {
    it("Should be an error because of wrong api key", function (done) {
      var contents = fs.readFileSync(path + '/createdContract1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .get('/contracts/' + contract_id+'/infocertificate')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Get a contract certificate info with no contract_id", function () {
    it("Should be an error because of no contract id", function (done) {
     var contract_id = null;
      chai.request(url)
        .get('/contracts/' + contract_id+'/infocertificate')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(404);
          done();
        });
    });
  });
  describe("Get a contract certificate info correctly", function () {
    it("Should return the contract info", function (done) {
      var contents = fs.readFileSync(path + '/createdContract1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .get('/contracts/' + contract_id+'/infocertificate')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          done();
          /* fs.writeFile(path + '/getContractCertificateInfo.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          }); */
        });
    });
  });
});

//CREATE CONTRACT BY HASH
describe("Creating a contract by hash...", function () {
  describe("Create a contract with wrong api key", function () {
    it("Should be an error because of wrong api key", function (done) {
      var contract_id = Math.random().toString();
      chai.request(url)
        .post('/contractsHash')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .field('contract_id', contract_id)
        .field('blockchain_type', blockchain_type_1)
        .field('number_signatories', number_signatories)
        .field('hash',file_hash)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Create a contract by hash without some parameters", function () {
    it("Should be an error because of parameter required", function (done) {
      var contract_id = Math.random().toString();
      chai.request(url)
        .post('/contractsHash')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('blockchain_type', blockchain_type_1)
        .field('number_signatories', number_signatories)
        .field('hash',file_hash)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Create a contract by hash with 'One by transaction' option", function () {
    it("Should return info", function (done) {
      var contract_id = Math.random().toString();
      chai.request(url)
        .post('/contractsHash')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('contract_id', contract_id)
        .field('blockchain_type', blockchain_type_1)
        .field('number_signatories', number_signatories)
        .field('hash',file_hash)
        .end(function (err, res) { // falta añadir que expect mas propiedades, falta informacion sobre contract
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          done();
          fs.writeFile(path + '/createdContractHash1.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          });
        });
    });
  });
  describe("Create a contract by hash with 'One by signer' option", function () {
    it("Should return info", function (done) {
      var contract_id = Math.random().toString();
      chai.request(url)
        .post('/contractsHash')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('contract_id', contract_id)
        .field('blockchain_type', blockchain_type_2)
        .field('number_signatories', number_signatories)
        .field('hash',file_hash)
        .end(function (err, res) { // falta añadir que expect mas propiedades, falta informacion sobre contract
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          done();
          fs.writeFile(path + '/createdContractHash2.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          });
        });
    });
  });
});

// SIGN A CONTRACT WITH HASH
describe("Signing a contract with hash...", function () {
  describe("Sign a contract with wrong api key", function () {
    it("Should be an error because of wrong api key", function (done) {
      var contents = fs.readFileSync(path + '/createdContractHash1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .post('/contractsHash/' + contract_id)
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .field('contract_id', contract_id)
        .field('user_tx_hash', user_tx_hash) // o .field('user_hash',user_hash)
        .field('user_name', 'pepe')
        .field('user_surname', 'perez')
        .field('hash',file_hash)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Signing a contract with hash without some parameters", function () {
    it("Should be an error because of parameter required", function (done) {
      var contents = fs.readFileSync(path + '/createdContractHash1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .post('/contractsHash/' + contract_id)
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .field('contract_id', contract_id)
        .field('user_name', 'pepe')
        .field('user_surname', 'perez')
        .field('hash',file_hash)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Signing a contract by hash with the user tx_hash", function () {
    it("Should return info", function (done) {
      var contents = fs.readFileSync(path + '/createdContractHash1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .post('/contractsHash/' + contract_id)
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('contract_id', contract_id)
        .field('user_tx_hash', user_tx_hash)
        .field('user_name', 'pepe')
        .field('user_surname', 'perez')
        .field('hash',file_hash)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          done();
          /* fs.writeFile(path + '/signedContractHashTxhash.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          }); */
        });
    });
  });
  describe("Signing a contract with the hash of digital img", function () {
    it("Should return info", function (done) {
      var contents = fs.readFileSync(path + '/createdContractHash1.json'); // o createdContract2.json
      var jsonContent = JSON.parse(contents);
      var contract_id = jsonContent.data.contract_id;
      chai.request(url)
        .post('/contractsHash/' + contract_id)
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('contract_id', contract_id)
        .field('user_hash', user_hash)
        .field('user_name', 'pepe')
        .field('user_surname', 'perez')
        .field('hash',file_hash)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          done();
         /*  fs.writeFile(path + '/signedContractHashImgHash.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          }); */
        });
    });
  });
});