/**
 * @fileoverview Obtains certificate
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
var myTxHash ='0x70c2d445ee5cd35f5655f250beafef7a5cae3784602fae066b03e0f1d8a0465d';
var host = config.host;
var myApiKey = config.apiKey;
var path = __dirname;

/**
 * Builds request to get a json certificate
 *
 * @param {*} apiKey
 * @param {*} txhash
 */
function getJsonCertificate(apiKey,txhash){
    request.debug = true;
    request({
        headers:{
        'accept':'application/pdf',
        'apiKey':apiKey
        },
        uri: host + '/v2/es/json/'+ txhash + '/certificate',
        method: 'GET'},
        function(err,res,body){
            if (!err) {
                fs.writeFile(path +'/getCertificate.json',res.body, function (err) {
                    console.log(err);
                    });
            } else {
                console.log(err);
            }
        });
}
getJsonCertificate(myApiKey,myTxHash);
