/**
 * @fileoverview Uploads a document signed
 *
 * @version 1.0
 *
 * @author Irene Garcia 
 *
 */
var request = require('request');
var fs = require('fs');
var config = require('../../config');

// Variables
var fileName = 'test.pdf'
var description = 'description example'
var path = __dirname;
var host = config.host;
var myApiKey = config.apiKey;

/**
 * Builds the request to upload a document signed
 *
 * @param {*} apiKey
 * @param {*} fileName
 * @param {*} description
 */
function uploadDocumentSigned(apiKey, fileName, description) {
    var file = path + fileName;
    var url = host + '/v2/es/documents/pdf-document';
    var headers = {
        'accept': 'application/json',
        'apiKey': apiKey,
    };
    const formData = {
        document: fs.createReadStream(file),
        description: description,
    };
    request.debug = true;
    request.post({ uri: url, headers: headers, formData: formData, }, function optionalCallback(err, res, body) {
        if (!err) {
            fs.writeFile(path + '/uploadDocumentSigned.json', res.body, function (err) {
                console.log(err);
            });
        } else {
            console.log(err);
        }
    });
};
uploadDocumentSigned(myApiKey, '/' + fileName, description);
