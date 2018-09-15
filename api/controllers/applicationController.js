'use strict';

// Generic error handler
function handleError(res, reason, message) {
  console.log('ERROR: ' + reason);
  res.status(500).json({'error': message});
}

exports.sendApplicationLog = function(req, res) {
  // Collect parameters
  var applog = req.query.applog;
  console.log('Application log sent:');
  console.log(applog);
  res.status(200).send(JSON.stringify({"response": 'OK'}));
};
