/**
 * @fileoverview Obtains certificate of a hash file
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
var myHash = '0137567E14CC852FB637116A093AEF145FC5E1BDA3E6513F2C9AD258F0E381C0'; // already created

/**
 * Builds request for obtaining the certificate
 *
 * @param {*} apiKey
 * @param {*} hash
 */
function getHashCertificate(apiKey, hash) {
    request.debug = true;
    request({
        headers: {
            'accept': 'application/pdf',
            'apiKey': apiKey
        },
        uri: host + '/v2/es/hash/' + hash + '/certificate',
        method: 'GET'
    },
        function (err, res, body) {
            if (!err) {
                fs.writeFile(path + '/getHashCert.json', res.body, function (err) {
                    console.log(err);
                });
            } else {
                console.log(err);
            }
        });
}
getHashCertificate(myApiKey, myHash);
