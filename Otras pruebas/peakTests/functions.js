var crypto = require('crypto');
var fs = require('file-system');

module.exports = {
  processId : processId,
  setParametersHash: setParametersHash,
  setParametersTemplate: setParametersTemplate,
  setUploadParams: setUploadParams,
  setUploadHashParams: setUploadHashParams,
  setHeadersParameters: setHeadersParameters,
  processData: processData,
  deleteDocumentData: deleteDocumentData,
  setParametersContract : setParametersContract,
  setParametersSign : setParametersSign,
  processContractData:processContractData,
  deleteContractData: deleteContractData,
  logHeaders: logHeaders,
};

var path = __dirname;

function setHeaders(requestParams, context, ee, next) {
  const headers = {
    'apiKey': '4aa869f378bc4251307eb99dd430cea8a1520282f372d718611764e8d1016f9e',
    'accept': 'application/json'
  };
  requestParams.headers = Object.assign({}, requestParams.headers, headers);
}

function logHeaders(requestParams, response, context, ee, next) {
  if (!(response.statusCode == 201) && !(response.statusCode == 200)) {
    console.log(response.body, requestParams.url);
  }
  return next(); // MUST be called for the scenario to continue
}

function createRandomHash() {
  var current_date = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
  return hash;
}
function processId(requestParams, response, context, ee, next) {
  if (response.statusCode == 201) {
  var jsonContent = JSON.parse(response.body);
  var tx_hash = jsonContent.txhash;
  const csv = '\n"' + tx_hash + '"';
  fs.appendFile(path + '/digitalId.csv', csv, function (err) {
    if (err) console.log(err);
  });
} else {
  console.log(response.body);
}
  return next(); // MUST be called for the scenario to continue
}

function setParametersHash(requestParams, context, ee, next) {
  setHeaders(requestParams, context, ee, next);
  var hash = createRandomHash();
  var formData = {
    'hash': hash
  };
  requestParams.formData = Object.assign({}, requestParams.formData, formData);
  //console.log(requestParams);
  return next(); // MUST be called for the scenario to continue
}

function setParametersTemplate(requestParams, context, ee, next) {
  setHeaders(requestParams, context, ee, next);
  var hash = createRandomHash();
  var file = path + '/template.jpg';
  var formData = {
    'hash': hash,
    'template': fs.createReadStream(file)
  };
  requestParams.formData = Object.assign({}, requestParams.formData, formData);
  // console.log(requestParams);
  return next(); // MUST be called for the scenario to continue
}

function setUploadParams(requestParams, context, ee, next) {
  setHeaders(requestParams, context, ee, next);
  var file = path + '/test.pdf';
  var formData = {
    'description': 'test de prueba',
    'document': fs.createReadStream(file)
  };
  requestParams.formData = Object.assign({}, requestParams.formData, formData);
  //console.log(requestParams);
  return next(); // MUST be called for the scenario to continue
}

function setUploadHashParams(requestParams, context, ee, next) {
  setHeaders(requestParams, context, ee, next);
  var hash = createRandomHash();
  var formData = {
    'hash': hash
  };
  requestParams.formData = Object.assign({}, requestParams.formData, formData);
  //console.log(requestParams);
  return next(); // MUST be called for the scenario to continue
}

function setHeadersParameters(requestParams, context, ee, next) {
  setHeaders(requestParams, context, ee, next);
  return next(); // MUST be called for the scenario to continue
}

function processData(requestParams, response, context, ee, next) {
  if (response.statusCode == 201) {
  var jsonContent = JSON.parse(response.body);
  var document_id = jsonContent.data.document_id;
  var tx_hash = jsonContent.data.tx_hash;
  const csv = '\n"' + document_id + '","' + tx_hash + '"';
  fs.appendFile(path + '/document.csv', csv, function (err) {
    if (err) console.log(err);
  });
} else {
  console.log(response.body);
}
  return next(); // MUST be called for the scenario to continue
}

function deleteDocumentData(requestParams, response, context, ee, next) {
  fs.readFile(path + '/document.csv', 'utf8', function (err, data) {
    if (err) throw err;

    var linesExceptFirst = data.split('\n').slice(1).join('\n');
    fs.writeFile(path + '/document.csv', linesExceptFirst, function (err) {
      if (err)
        return console.log(err);
    });
  });
  return next(); // MUST be called for the scenario to continue
}

function setParametersContract(requestParams, context, ee, next) {
  setHeaders(requestParams, context, ee, next);
  var file = path +'/test.pdf';
  var contract_id = Math.random().toString();
  var formData = {
    'contract_id': contract_id,
    'blockchain_type': 'by_contract',
    'number_signatories': 1,
    'contract': fs.createReadStream(file)
  };
  requestParams.formData = Object.assign({}, requestParams.formData, formData);
  return next(); // MUST be called for the scenario to continue
}

function setParametersSign(requestParams,context, ee, next) {
  setHeaders(requestParams, context, ee, next);
  var url = requestParams.url;
  var user_hash = requestParams.user_hash;
  var contract_id = url.substring(49);
  var formData = {
    'contract_id': contract_id,
    'user_hash': user_hash,
    'user_name': 'pepe',
    'user_surname': 'perez'
  };
  requestParams.formData = Object.assign({}, requestParams.formData, formData);
  return next(); // MUST be called for the scenario to continue
}

function processContractData(requestParams, response, context, ee, next) {
  if (response.statusCode == 201) {
  var jsonContent = JSON.parse(response.body);
  var contract_id = jsonContent.data.contract_id;
  const csv = '\n"' + contract_id + '"';
  fs.appendFile(path + '/contract.csv', csv, function (err) {
    if (err) console.log(err);
  });
} else {
  console.log(response.body);
}
  return next(); // MUST be called for the scenario to continue
}

function deleteContractData(requestParams, response, context, ee, next) {
  fs.readFile(path + '/contract.csv', 'utf8', function (err, data) {
    if (err) throw err;

    var linesExceptFirst = data.split('\n').slice(1).join('\n');
    fs.writeFile(path + '/contract.csv', linesExceptFirst, function (err) {
      if (err)
        return console.log(err);
    });
  });
  console.log(response.body,requestParams.body);
  return next(); // MUST be called for the scenario to continue
}