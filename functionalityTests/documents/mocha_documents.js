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

describe("Uploading a document ", function () {

    describe("Upload a document with no description", function () {
      it("Should be an error because of lack of description", function (done) {
        var file = path + '/test.pdf';
        chai.request(url)
          .post('/documents')
          .type('form')
          .set('accept', 'application/json')
          .set('apiKey', apiKey)
          .attach('document', fs.readFileSync(file), 'test.pdf')
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('type', 'invalid');
            done();
          });
      });
    });
  
    describe("Uploading a document with wrong apikey", function () {
      it("Should be an error because of wrong apikey", function (done) {
        var file = path + '/test.pdf';
        chai.request(url)
          .post('/documents')
          .type('form')
          .set('accept', 'application/json')
          .set('apiKey', apiKeyError)
          .attach('document', fs.readFileSync(file), 'test.pdf')
          .field('description', ' test de prueba')
          .end(function (err, res) {
            expect(res).to.be.json;
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('type', 'invalid');
            done();
          });
      });
    });
    describe("Upload a document with no file attached and no description", function () {
        it("Should be an error because of file and description required", function (done) {
          chai.request(url)
          .post('/documents')
          .type('form')
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

    describe("Uploading document correctly", function () {
      it("Should return the document info", function (done) {
        var file = path + '/test.pdf';
        chai.request(url)
        .post('/documents')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .attach('document', fs.readFileSync(file), 'test.pdf')
        .field('description', ' test de prueba')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(201);
          done();
            fs.writeFile(path+'/fileUploaded.json', JSON.stringify(res.body), function (err) {
              if (err) console.log(err);
            });
          });
      });
    });
  });
  
 describe("Uploading a pdf signed document ", function () {

  describe("Upload a pdf signed document with no description", function () {
    it("Should be an error because of lack of description", function (done) {
      var file = path + '/test.pdf';
      chai.request(url)
        .post('/documents/pdf-document')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .attach('document', fs.readFileSync(file), 'test.pdf')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });

  describe("Uploading a pdf document with wrong apikey", function () {
    it("Should be an error because of wrong apikey", function (done) {
      var file = path + '/test.pdf';
      chai.request(url)
        .post('/documents/pdf-document')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKeyError)
        .attach('document', fs.readFileSync(file), 'test.pdf')
        .field('description', ' test de prueba')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
    });
  });
  describe("Upload a document with no file attached and no description", function () {
      it("Should be an error because of file and description required", function (done) {
        chai.request(url)
        .post('/documents/pdf-document')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
         // expect(res).to.be.json;
          expect(res).to.have.status(400); // devuelve Internal Server Error 500, pero deberia ser 400 si seguimos con misma estructura que antes
          //expect(res.body).to.have.property('type', 'invalid');
          done();
        });
      });
    });
    describe("Upload a document with invalid type (no pdf)", function () {
      it("Should be an error because of invalid document type", function (done) {
        var file = path + '/templateOK.jpg';
        chai.request(url)
        .post('/documents/pdf-document')
        .type('form')
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .attach('document', fs.readFileSync(file), 'templateOK.jpg')
        .field('description', ' test de prueba')
        .end(function (err, res) {
          expect(res).to.be.json;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('type', 'invalid');
          done();
        });
      });
    });

  describe("Uploading document correctly", function () {
    it("Should return the document info", function (done) {
      var file = path + '/test.pdf';
      chai.request(url)
      .post('/documents/pdf-document')
      .type('form')
      .set('accept', 'application/json')
      .set('apiKey', apiKey)
      .attach('document', fs.readFileSync(file), 'test.pdf')
      .field('description', ' test de prueba')
      .end(function (err, res) {
        expect(res).to.be.json;
        expect(res).to.have.status(201);
        done();
          fs.writeFile(path+'/signedFileUploaded.json', JSON.stringify(res.body), function (err) {
            if (err) console.log(err);
          });
        });
    });
  });
});

describe("Getting a document ", function () {

  describe("Get a document with wrong apikey", function () {
    it("Should be an error because of wrong apikey", function (done) {
      var contents = fs.readFileSync(path + '/fileUploaded.json'); // o signedFileUploaded.json
      var jsonContent = JSON.parse(contents);
      var document_id = jsonContent.document_id;
      chai.request(url)
      .get('/documents/'+ document_id)
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
  describe("Get a document that doesn't exist or there is not document_id", function () {
      it("Should be an error because no document found", function (done) {
        var document_id_error = '123abc';
        chai.request(url)
        .get('/documents/'+document_id_error)
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res.body).to.have.property('message', 'document not found');
          expect(res).to.have.status(404);
          done();
        });
      });
    });

  describe("Get a document correctly", function () {
    it("Should return the document info", function (done) {
      var contents = fs.readFileSync(path + '/fileUploaded.json'); // o signedFileUploaded.json
      var jsonContent = JSON.parse(contents);
      var document_id = jsonContent.data.document_id;
      chai.request(url)
      .get('/documents/'+document_id)
      .set('accept', 'application/json')
      .set('apiKey', apiKey)
      .end(function (err, res) {
        //añadir expect de cada cosa qhe deberia devolver
        expect(res).to.be.json;
        expect(res).to.have.status(200); // no deberia devolver file_base64, eso es al hacer /certificate
        done();
        fs.writeFile(path+'/getDocument.json', JSON.stringify(res.body), function (err) {
          if (err) console.log(err);
          });
        });
    });
  });
});

describe("Getting a document certificate", function () {

  describe("Get a document certificate with wrong apikey", function () {
    it("Should be an error because of wrong apikey", function (done) {
      var contents = fs.readFileSync(path + '/fileUploaded.json'); // o signedFileUploaded.json
      var jsonContent = JSON.parse(contents);
      var document_id = jsonContent.document_id;
      chai.request(url)
      .get('/documents/'+ document_id+'/certificate')
      .set('accept', 'application/pdf')
      .set('apiKey', apiKeyError)
      .end(function (err, res) {
        expect(res).to.be.json;
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('type', 'invalid');
        done();
      });
    });
  });
  describe("Get a document certificate of file that doesn't exist or there is not document_id", function () {
      it("Should be an error because no document found", function (done) {
        var document_id_error = '123abc';
        chai.request(url)
        .get('/documents/'+document_id_error+'/certificate')
        .set('accept', 'application/pdf')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res.body).to.have.property('message', 'document not found');
          expect(res).to.have.status(404);
          done();
        });
      });
    });

  describe("Get a document certificate correctly", function () {
    it("Should return the document info", function (done) {
      var contents = fs.readFileSync(path + '/fileUploaded.json'); // o signedFileUploaded.json
      var jsonContent = JSON.parse(contents);
      var document_id = jsonContent.data.document_id;
      chai.request(url)
      .get('/documents/'+document_id+'/certificate')
      .set('accept', 'application/pdf')
      .set('apiKey', apiKey)
      .end(function (err, res) {
        //añadir expect de cada cosa qhe deberia devolver
        expect(res).to.be.json;
        expect(res).to.have.status(200); 
        done();
        fs.writeFile(path+'/getDocumentCert.json', JSON.stringify(res.body), function (err) {
          if (err) console.log(err);
          });
        });
    });
  });
});

describe("Getting a document certificate info", function () {

  describe("Get a document certificate with wrong apikey", function () {
    it("Should be an error because of wrong apikey", function (done) {
      var contents = fs.readFileSync(path + '/fileUploaded.json'); // o signedFileUploaded.json
      var jsonContent = JSON.parse(contents);
      var document_id = jsonContent.document_id;
      chai.request(url)
      .get('/documents/'+ document_id+'/infocertificate')
      .set('accept', 'application/pdf')
      .set('apiKey', apiKeyError)
      .end(function (err, res) {
        expect(res).to.be.json;
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('type', 'invalid');
        done();
      });
    });
  });
  describe("Get a document certificate info of file that doesn't exist or there is not document_id", function () {
      it("Should be an error because no document found", function (done) {
        var document_id_error = '123abc';
        chai.request(url)
        .get('/documents/'+document_id_error+'/infocertificate')
        .set('accept', 'application/pdf')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res.body).to.have.property('message', 'document not found');
          expect(res).to.have.status(404);
          done();
        });
      });
    });

  describe("Get a document certificate info correctly", function () {
    it("Should return the document info", function (done) {
      var contents = fs.readFileSync(path + '/fileUploaded.json'); // o signedFileUploaded.json
      var jsonContent = JSON.parse(contents);
      var document_id = jsonContent.data.document_id;
      chai.request(url)
      .get('/documents/'+document_id+'/infocertificate')
      .set('accept', 'application/pdf')
      .set('apiKey', apiKey)
      .end(function (err, res) {
        //añadir expect de cada cosa qhe deberia devolver
        expect(res).to.be.json;
        expect(res).to.have.status(200); 
        done();
        fs.writeFile(path+'/getDocumentCertInfo.json', JSON.stringify(res.body), function (err) {
          if (err) console.log(err);
          });
        });
    });
  });
});


describe("Deleting a document ", function () {

  describe("Delete a document with wrong apikey", function () {
    it("Should be an error because of wrong apikey", function (done) {
      var contents = fs.readFileSync(path + '/fileUploaded.json'); // o signedFileUploaded.json
      var jsonContent = JSON.parse(contents);
      var document_id = jsonContent.document_id;
      chai.request(url)
      .delete('/documents/'+ document_id)
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
  describe("Delete a document that doesn't exist or there is not document_id", function () {
      it("Should be an error because no document found", function (done) {
        var document_id_error = '123abc';
        chai.request(url)
        .delete('/documents/'+document_id_error)
        .set('accept', 'application/json')
        .set('apiKey', apiKey)
        .end(function (err, res) {
          expect(res.body).to.have.property('message', 'document not found');
          expect(res).to.have.status(404);
          done();
        });
      });
    });

  describe("Delete a document correctly", function () {
    it("Should return the document info", function (done) {
      var contents = fs.readFileSync(path + '/fileUploaded.json'); // o signedFileUploaded.json
      var jsonContent = JSON.parse(contents);
      var document_id = jsonContent.data.document_id;
      chai.request(url)
      .delete('/documents/'+document_id)
      .set('accept', 'application/json')
      .set('apiKey', apiKey)
      .end(function (err, res) {
        expect(res).to.be.json;
        expect(res).to.have.status(200); // Deberia devolver tambien informacion sobre documento borrado
        done();
        fs.writeFile(path+'/deletedDocument.json', JSON.stringify(res.body), function (err) {
          if (err) console.log(err);
          });
        });
    });
  });
});

