/**
 * @fileoverview Register a hash file
 *
 * @version 1.0
 *
 * @author Irene Garcia 
 *
 */
var request = require('request');
var config = require('../../config');
var fs = require('file-system');

// Variables
var host = config.host;
var myApiKey = config.apiKey;
var path = __dirname;
var myHash = '0137567E14CC852FB637116A093AEF145FC5E1BDA3E6513F2C9AD258F0E381C0';

/**
 * Builds request to register a hash file
 *
 * @param {*} apiKey
 * @param {*} hash
 */
function registerHash(apiKey, hash) {
    var url = host + '/v2/es/hash';
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
            fs.writeFile(path + '/registerHash.json', res.body, function (err) {
                console.log(err);
            });
        } else {
            console.log(err);
        }
    });
};
registerHash(myApiKey, myHash);