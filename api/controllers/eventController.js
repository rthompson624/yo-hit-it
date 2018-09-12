'use strict';

// Generic error handler
function handleError(res, reason, message) {
  console.log('ERROR: ' + reason);
  res.status(500).json({'error': message});
}

exports.getEvents = function(req, res) {
  // Collect request parameter
  var request = req.query.request;

  // Prepare to make http request to CitySpark server...
  var https = require('https');
  var querystring = require('querystring');
  // Get data from CitySpark
  var options = {
    hostname: 'portal.cityspark.com',
    port: 443,
    path: '/api/events/getevents2?request=' + querystring.escape(request),
    method: 'GET',
    headers: {}
  };
  var data = '';
  https.get(options, (citySparkRes) => {
    // A chunk of data has been received.
    citySparkRes.on('data', (chunk) => {
      data += chunk;
    });
    // The whole response has been received.
    citySparkRes.on('end', () => {
      // Send data to client
      return res.status(200).send(data);
    });
  })
  .on('error', (err) => {
    handleError(res, err.message, 'Error during CitySpark API call.');
  });
};
