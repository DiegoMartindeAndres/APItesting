/**
 * @fileoverview Creates a request to create a digital id
 *
 * @version 1.0
 *
 * @author Irene Garcia 
 *
 */
const request = require('request');
const fs = require('file-system');
const crypto = require('crypto');
var config = require('../../config');

// Variables
var host = config.host;
var myApiKey = config.apiKey;
var myHash = createRandomHash();
var path = __dirname;

/**
 * Creates a random hash
 *
 * @returns hash
 */
function createRandomHash() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
    return hash;
}

/**
 * Builds the request to create a digital id
 *
 * @param {*} apiKey
 * @param {*} hash
 */
function createId(apiKey, hash) {
    var url = host + '/v2/es/id/nodalblock';
    var headers = {
        'accept': 'application/json',
        'apiKey': apiKey,
    };
    const formData = {
        hash: hash
    }
    request.debug = true;
    request.post({ uri: url, headers: headers, formData: formData, }, function optionalCallback(err, res, body) {
        if (!err) {
            fs.writeFile(path + '/createdId.json', res.body, function (err) {
                console.log(err);
            });
        } else {
            console.log(err);
        }
    });
};
createId(myApiKey, myHash);