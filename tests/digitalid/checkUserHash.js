/**
 * @fileoverview Creates a request to verify a digital id using a user hash
 *
 * @version 1.0
 *
 * @author Irene Garcia 
 *
 */
var request = require('request');
var fs = require('file-system');
const crypto = require('crypto')
var base64Img = require('base64-img');
var config = require('../../config');

// Variables
var host = config.host;
var myApiKey = config.apiKey;
var path = __dirname;
var file = path + '/createdByTemplate.json';
var contents = fs.readFileSync(file);
var jsonContent = JSON.parse(contents);
var base64 = jsonContent.digital_id;
var template = 'template.jpg';

/**
 * Transforms base 64 image to png
 *
 * @param {*} base64
 * @param {*} name
 * @returns
 */
function base64toImg(base64, name) {
    base64Img.img(base64, path, name, function (err, path) {
        if (err) throw err;
    });
    return name + '.png';
}

/**
 * Builds the request to verify the digital id with user hash
 *
 * @param {*} apiKey
 * @param {*} base64
 * @param {*} template
 */
function checkUserHash(apiKey, base64, template) {
    var name = base64toImg(base64, 'digital_id');
    var file = path + '/' + name;
    var input = fs.createReadStream(file);
    let hash = crypto.createHash('sha256');
    var hashResult = '';
    input.on('readable', function () {
        const data = input.read();
        if (data)
            hash.update(data);
        else {
            hashResult = hash.digest('hex');
        }
    });
    input.on('end', () => {
        const formData = {
            hash: hashResult,
            template: fs.createReadStream(path + '/' + template)
        };
        var url = host + '/v2/es/id/verify/userHash';
        var headers = {
            'accept': 'application/json',
            'apiKey': apiKey,
        };

        request.debug = true;
        request.post({ uri: url, headers: headers, formData: formData, }, function optionalCallback(err, res, body) {

            if (!err) {
                console.log(res.statusCode);
                console.log(res.body);
            } else {
                console.log(err);
            }
        });
    });
};
checkUserHash(myApiKey, base64, template);