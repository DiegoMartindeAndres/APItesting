/**
 * @fileoverview Creates a request to upload a contract
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
var contract_id = Math.random();
var blockchain_type = 'by_signer'; // o by_contract
var number_signatories = 1;
var file = 'test.pdf';
var path = __dirname;
var host = config.host;
var myApiKey = config.apiKey;

/**
 * Builds the request to upload a contract
 *
 * @param {*} apiKey
 * @param {*} contract_id
 * @param {*} blockchain_type
 * @param {*} number_signatories
 * @param {*} file
 */
function createContract(apiKey, contract_id, blockchain_type, number_signatories, file) {
    var url = host + '/v2/es/contracts';
    var headers = {
        'accept': 'application/json',
        'apiKey': apiKey,
    };
    const formData = {
        contract_id: contract_id,
        blockchain_type: blockchain_type,
        number_signatories: number_signatories,
        contract: fs.createReadStream(path + '/' + file)
    }
    request.debug = true;
    request.post({ uri: url, headers: headers, formData: formData, }, function optionalCallback(err, res, body) {
        if (!err) {
            fs.writeFile(path +'/createdContract.json',res.body, function (err) {
                console.log(err);
                });
        } else {
            console.log(err);
        }
    });
};
createContract(myApiKey, contract_id, blockchain_type, number_signatories, file);