/**
 * @fileoverview Creates a request to verify a digital id using a file
 *
 * @version 1.0
 *
 * @author Irene Garcia 
 *
 */
var request = require('request');
var fs = require('file-system');
var base64Img = require('base64-img');
var config = require('../../config');

// Variables
var args = process.argv;
var myJson = '/createdByTemplate.json';
var host = config.host;
var myApiKey = config.apiKey;
var path = __dirname;
var file = path + myJson;
var contents = fs.readFileSync(file);
var jsonContent = JSON.parse(contents);
var base64 = jsonContent.digital_id;
var myTxHash = jsonContent.txhash;
var full = 'true';

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
 * Builds the request to verify the digital id
 *
 * @param {*} apiKey
 * @param {*} base64
 * @param {*} txhash
 */
function checkIdByFile(apiKey, base64, txhash) {
  var name = base64toImg(base64, 'digital_id');
  var url = host + '/v2/es/id/verify/file';
  var headers = {
    'accept': 'application/json',
    'apiKey': apiKey,
  };
  var file = path + '/' + name;
  try {
    var digital_id = fs.createReadStream(file);
    console.log(digital_id)
  } catch (err) {
    console.error(err)
  }
  var formData = {
    txhash: txhash,
    digital_id: digital_id,
    full: full
  }
  request.debug = true;
  request.post({ uri: url, headers: headers, formData: formData, }, function optionalCallback(err, res, body) {
    if (!err) {
      fs.writeFile(path + '/checkFile.json', res.body, function (err) {
        console.log(err);
      });
    } else {
      console.log(err);
    }
  });
}

checkIdByFile(myApiKey, base64, myTxHash);