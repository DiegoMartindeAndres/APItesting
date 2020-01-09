/**
 * @fileoverview Creates a request to get a contract
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
var contract_id = 'c1'; // Contract_id already created
var host = config.host;
var myApiKey = config.apiKey;
var path = __dirname;

/**
 * Builds the request to obtain a contract given its contract id
 *
 * @param {*} apiKey
 * @param {*} contract_id
 */
function getContract(apiKey, contract_id) {
    request.debug = true;
    request({
        headers: {
            'accept': 'application/json',
            'apiKey': apiKey
        },
        uri: host + '/v2/es/contracts/' + contract_id,
        method: 'GET'
    },
        function (err, res, body) {
            if (!err) {
                fs.writeFile(path + '/getContract.json', res.body, function (err) {
                    console.log(err);
                });
            } else {
                console.log(err);
            }
        });
}
getContract(myApiKey, contract_id);
