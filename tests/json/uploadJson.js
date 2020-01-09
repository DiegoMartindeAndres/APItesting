/**
 * @fileoverview Upload json data
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
var host = config.host;
var myApiKey = config.apiKey;
var path = __dirname;
var myFormData={
    id: '12',
    date: '24/10'
};

/**
 * Builds request to upload json data
 *
 * @param {*} apiKey
 * @param {*} myFormData
 */
function uploadJson(apiKey,myFormData) {
    var url = host + '/v2/es/json';
    var headers = {
        'accept': 'application/json',
        'apiKey': apiKey,
    };
    const formData = {
        json: JSON.stringify(myFormData)
    }
    request.debug = true;
    request.post({ uri: url, headers: headers, formData: formData, }, function optionalCallback(err, res, body) {
        if (!err) {
            fs.writeFile(path +'/uploadData.json',res.body, function (err) {
                console.log(err);
                });
        } else {
            console.log(err);
        }
    });
};
uploadJson(myApiKey, myFormData);