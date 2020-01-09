/**
 * @fileoverview Creates a request to get the information about a contract certificate
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
var contract_id = 'c1';
var isTxHash = '0'; // 0 if txhash, 1 if hash of img digital
var hash = '0x52a167ba7a86be47c10401a58ae8b24103357c18bc461f7c573b23597ffb7562';// txhash of id digital created or hash of digital image
var user_name = 'pepe';
var user_surname = 'perez';
var host = config.host;
var myApiKey = config.apiKey;
var path = __dirname;


/**
 * Builds the request to sign a contract already created
 *
 *
 * @param {*} apiKey
 * @param {*} contract_id
 * @param {*} isTxHash
 * @param {*} hash
 * @param {*} user_name
 * @param {*} user_surname
 */
function signContract(apiKey, contract_id, isTxHash, hash, user_name, user_surname) {
    var url = host + '/v2/es/contracts/' + contract_id;
    var headers = {
        'accept': 'application/json',
        'apiKey': apiKey,
    };
    if (isTxHash === '0') {
        var formData = {
            user_tx_hash: hash,
            user_name: user_name,
            user_surname: user_surname
        }
    } else {
        var formData = {
            user_hash: hash,
            user_name: user_name,
            user_surname: user_surname
        }
    }
    request.debug = true;
    request.post({ uri: url, headers: headers, formData: formData }, function optionalCallback(err, res, body) {
        if (!err) {
            fs.writeFile(path + '/signContract.json', res.body, function (err) {
                console.log(err);
            });
        } else {
            console.log(err);
        }
    });
};
signContract(myApiKey, contract_id, isTxHash, hash, user_name, user_surname);