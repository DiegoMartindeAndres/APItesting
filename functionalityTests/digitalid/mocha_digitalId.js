const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const fs = require('file-system');
const crypto = require('crypto');
const base64Img = require('base64-img');
var config = require('../../config');

chai.use(chaiHttp);
const url = "https://test.api.nodalblock.com/v2/es";
var path = __dirname;

//Parametros
var apiKey = config.apiKey;

function createHash() {
  var current_date = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
  return hash;
}

describe("Creating new digital id ", function () {

  describe("Creating new digital id with wrong hash", function () {
    it("Should be an error because of hash already used", function (done) {
      var hashError = "1ef4674feb1ddc81d2b8fc2b3c3878f3";
      chai.request(url)
        .post('/id/nodalblock')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field({ hash: hashError })
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'required');
          done();
        });
    });
  });

  describe("Creating new digital id with wrong apikey", function () {
    it("Should be an error because of wrong apikey", function (done) {
      var apiKeyError = "123";
      var hash = createHash();
      chai.request(url)
        .post('/id/nodalblock')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .field({ hash: hash })
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });

  describe("Creating new digital id correctly", function () {
    it("Should return the digital_id and txhash", function (done) {
      var hash = createHash();
      chai.request(url)
        .post('/id/nodalblock')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .send({ hash: hash })
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('digital_id');
          expect(res.body).to.have.property('txhash');
          done()
          fs.writeFile(path +'/createdNormal.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          });
        });
    });
  });
});


describe("Creating new custom digital id, with a template", function () {
  describe("Creating new custom digital id with wrong hash", function () {
    it("Should be an error because of hash already used", function (done) {
      var hashError = "1ef4674feb1ddc81d2b8fc2b3c3878f3";
      var file = path + '/templateError.png';
      chai.request(url)
        .post('/id/custom')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        //.send({hash: hash,template:fs.readFileSync(path)})
        // To upload a file no 'send', 'field' y 'attach'
        .field('hash', hashError)
        .attach('template', fs.readFileSync(file), 'templateOK.jpg')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);//no deberia ser 401, unauthorisded request, como en el resto, no bad request
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });

  describe("Creating new custom digital id with wrong apikey", function () {
    it("Should be an error because of wrong apikey", function (done) {
      var file = path +'/templateError.png';
      var apiKeyError = "123";
      var hash = createHash();
      chai.request(url)
        .post('/id/custom')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .field('hash', hash)
        .attach('template', fs.readFileSync(file), 'templateOK.jpg')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401); //deberia ser 400
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });

  describe("Creating new custom id with template out of size", function () {
    var file = path +'/templateError.png';
    var hash = createHash();
    it("Should be an error because template not 800x470", function (done) {
      chai.request(url)
        .post('/id/custom')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('hash', hash)
        .attach('template', fs.readFileSync(file), 'templateError.png')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Creating new custom id with correct template", function () {
    var file = path +'/templateOK.jpg';
    var hash = createHash();
    it("Should create a custom id", function (done) {
      chai.request(url)
        .post('/id/custom')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .field('hash', hash)
        .attach('template', fs.readFileSync(file), 'templateOK.jpg')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res.body).to.have.property('digital_id');
          expect(res.body).to.have.property('txhash');
          expect(res).to.have.status(201); 
          done();
          fs.writeFile(path + '/createdByTemplate.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          });
        });
    });
  });
});

describe("Checking digital id by hash", function () {
  describe("Checking digital id with wrong api key", function () {
    it("Should be an error because of invalid api key", function (done) {
      var name = 'digital_id';
      var contents = fs.readFileSync(path + '/createdByTemplate.json');
      var jsonContent = JSON.parse(contents);
      var base64 = jsonContent.digital_id;
      var txHash = jsonContent.txhash;
      var full = 'true';
      var apiKeyError = '123';

      base64Img.img(base64, path, name, function (err, path) {
        if (err) throw err;
      });
      var file = path + '/' + name + '.png';
      var input = fs.createReadStream(file);
      let hash = crypto.createHash('sha256');
      var hashResult = '';
      input.on('readable', function () {
        const data = input.read();
        if (data)
          hash.update(data);
        else {
          hashResult = hash.digest('hex');
        }
      });
      input.on('end', () => {
        chai.request(url)
          .post('/id/verify/hash')
          .type('form')
          .set('accept', 'application/json')
          .set('apiKey', apiKeyError)
          .field('hash', hashResult)
          .field('txhash', txHash)
          .field('full', full)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('type', 'invalid');
            done();
          });
      });
    });
  });
  describe("Checking custom digital id with correct parameters", function () {
    it("Should return true", function (done) {
      var name = 'digital_id';
      var contents = fs.readFileSync(path + '/createdByTemplate.json');
      var jsonContent = JSON.parse(contents);
      var base64 = jsonContent.digital_id;
      var txHash = jsonContent.txhash;
      var full = 'true';
      base64Img.img(base64, path, name, function (err, path) {
        if (err) throw err;
      });
      var file = path + '/' + name + '.png';
      var input = fs.createReadStream(file);
      let hash = crypto.createHash('sha256');
      var hashResult = '';
      input.on('readable', function () {
        const data = input.read();
        if (data)
          hash.update(data);
        else {
          hashResult = hash.digest('hex');
        }
      });
      input.on('end', () => {
        console.log(hashResult);
        chai.request(url)
          .post('/id/verify/hash')
          .type('form')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .field('hash', hashResult)
          .field('txhash', txHash)
          .field('full', full)
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('result', true);
            done();
          });
      });
    });
  });
});


// PODRIA MEJORARSE, QUE NO SE HAGA DOS VECES LO MISMO ?????
describe("Checking digital id by file", function () {

  describe("Checking digital id with wrong api key", function () {
    it("Should be an error because of invalid api key", function (done) {
     var json = path + '/createdNormal.json';
      var contents = fs.readFileSync(json);
      var jsonContent = JSON.parse(contents);
      var base64 = jsonContent.digital_id;
      var txHash = jsonContent.txhash;
      var full = 'true';
      var name = 'digital_id';

      base64Img.img(base64, path, name, function (err, path) {
        if (err) throw err;
      });
      try {
        var digital_id = fs.createReadStream(path + '/' + name + '.png');
      } catch (err) {
        console.error(err)
      }
      var apiKeyError = '123';
      chai.request(url)
        .post('/id/verify/file')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .attach('digital_id', digital_id)
        .field('txhash', txHash)
        .field('full', full)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Checking  digital id by file with correct parameters", function () {
    it("Should return true", function (done) {
       var json = path + '/createdNormal.json';
      var contents = fs.readFileSync(json);
      var jsonContent = JSON.parse(contents);
      var base64 = jsonContent.digital_id;
      var txHash = jsonContent.txhash;
      var full = 'true';
      var name = 'digital_id';

      base64Img.img(base64, path, name, function (err, path) {
        if (err) throw err;
      });
      try {
        var digital_id = fs.createReadStream(path + '/' + name + '.png');
      } catch (err) {
        console.error(err)
      }
      chai.request(url)
        .post('/id/verify/file')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .attach('digital_id', digital_id)
        .field('txhash', txHash)
        .field('full', full)
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('result', true);
          done();
        });
    });
  });
});
 
/*
// FALTA POR HACER, NO SE SI ES SHA256 DE DIGITAL ID O QUE HASH HAY QUE ENVIAR
describe("Checking digital id by user hash: template + hash", function () {

  describe("Checking digital id with wrong api key", function () {
    it("Should be an error because of invalid api key", function (done) {

    });
  });
  describe("Checking  digital id by file with invalid hash", function () {
    it("Should be an error because invalid hash", function (done) {
    });
  });
  describe("Checking  digital id by file with invalid template", function () {
    it("Should be an error because invalid template", function (done) {
    });
  });
  describe("Checking  digital id by file with correct parameters", function () {
    it("Should return true", function (done) {
    });
  });
});
*/