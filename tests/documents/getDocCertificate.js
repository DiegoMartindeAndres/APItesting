/**
 * @fileoverview Obtains certificate of a document given its id
 *
 * @version 1.0
 *
 * @author Irene Garcia 
 *
 */
var request = require('request');
var fs = require('file-system');
var config = require('../../config');

// Variables
var docId = '82ca47a1-30ba-11ea-9afc-02a6c2c659f8';
var host = config.host;
var myApiKey = config.apiKey;
var path = __dirname;

/**
 * Builds the request to get the certificate of a already created document
 *
 * @param {*} apiKey
 * @param {*} id
 */
function getDocumentCertificate(apiKey, id) {
    request.debug = true;
    request({
        headers: {
            'accept': 'application/pdf',
            'apiKey': apiKey
        },
        uri: host + '/v2/es/documents/' + id + '/certificate',
        method: 'GET'
    },
        function (err, res, body) {
            if (!err) {
                fs.writeFile(path + '/getCertificate.json', res.body, function (err) {
                    console.log(err);
                });
            } else {
                console.log(err);
            }
        });
}
getDocumentCertificate(myApiKey, docId);
