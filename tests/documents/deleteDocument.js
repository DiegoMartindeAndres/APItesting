/**
 * @fileoverview Deletes a document given its id
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
var docId ='82ca47a1-30ba-11ea-9afc-02a6c2c659f8'; // already created
var host = config.host;
var myApiKey = config.apiKey;
var path = __dirname;

/**
 * Builds the request to delete a document
 *
 * @param {*} apiKey
 * @param {*} id
 */
function deleteDocument(apiKey, id) {
    request({
        headers: {
            'accept': 'application/json',
            'apiKey': apiKey
        },
        uri: host + '/v2/es/documents/' + id,
        method: 'DELETE'
    },
        function (err, res, body) {
            if (!err) {
                fs.writeFile(path +'/deleteDocument.json',res.body, function (err) {
                    console.log(err);
                    });
            } else {
                console.log(err);
            }
        });
}
deleteDocument(myApiKey, docId);