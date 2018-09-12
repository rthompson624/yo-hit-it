exports.getUtcOffset = function(req, res) {
  const GOOGLE_API_KEY = 'AIzaSyA_3IweBHQAauD_DTlS3-k22vYHnFB5Q5Y';

  // Collect placeID parameter
  var placeID = req.query.placeID;
  console.log('placeID: ' + placeID);

  // Prepare to make http request to Google server...
  var https = require('https');
  var querystring = require('querystring');

  // Test: https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=utc_offset&key=AIzaSyA_3IweBHQAauD_DTlS3-k22vYHnFB5Q5Y

  // Get data from Google
  var options = {
    hostname: 'maps.googleapis.com',
    port: 443,
    path: '/maps/api/place/details/json?placeid=' + querystring.escape(placeID) + '&fields=utc_offset&key=' + GOOGLE_API_KEY,
    method: 'GET',
    headers: {}
  };
  var data = '';
  https.get(options, (googleRes) => {
    // A chunk of data has been received.
    googleRes.on('data', (chunk) => {
      data += chunk;
    });
    // The whole response has been received.
    googleRes.on('end', () => {
      // Send data to client
      return res.status(200).send(data);
    });
  })
  .on('error', (err) => {
    handleError(res, err.message, 'Error during Google Places API call.');
  });
};
