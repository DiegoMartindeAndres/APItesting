/**
 * @fileoverview Creates a request to create a custom Id
 *
 * @version 1.0
 *
 * @author Irene Garcia 
 *
 */
var fs = require('file-system');
var request = require('request');
var config = require('../../config');

// Variables
var host = config.host;
var myApiKey = config.apiKey;
var myHash = '391294f5d75aa8fa3f6cb2577bcee4095472b78fe29c96ae62c9236d6c5b694u'; // hash of a user
var myTemplate = '/template.jpg';
var path = __dirname;

/**
 * Builds the request to create a custom digital id
 *
 * @param {*} apiKey
 * @param {*} hash
 * @param {*} template
 */
function createCustomId(apiKey, hash, template) {
    var file = path + template;
    var url = host + '/v2/es/id/custom';
    var headers = {
        'accept': 'application/json',
        'apiKey': apiKey,
    };
    const formData = {
        hash: hash,
        template: fs.createReadStream(file),
    }
    request.debug = true;
    request.post({ uri: url, headers: headers, formData: formData, }, function optionalCallback(err, res, body) {
        if (!err) {
            fs.writeFile(path + '/createdByTemplate.json', res.body, function (err) {
                console.log(err);
            });
        } else {
            console.log(err);
        }
    });
};
createCustomId(myApiKey, myHash, myTemplate);