/**
 * @fileoverview Creates a request to get a contract certificate
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
 * Builds the request to obtain the certificate of a contract given its contract id
 *
 * @param {*} apiKey
 * @param {*} contract_id
 */
function getContractCertificate(apiKey, contract_id) {
    request.debug = true;
    request({
        headers: {
            'accept': 'application/pdf',
            'apiKey': apiKey
        },
        uri: host + '/v2/es/contracts/' + contract_id + '/certificate',
        method: 'GET'
    },
        function (err, res, body) {
            if (!err) {
                fs.writeFile(path + '/getContractCert.json', res.body, function (err) {
                    console.log(err);
                });
            } else {
                console.log(err);
            }
        });
}
getContractCertificate(myApiKey, contract_id);
