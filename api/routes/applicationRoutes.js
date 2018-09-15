'use strict';

module.exports = function(app) {
  var applicationController = require('../controllers/applicationController');

  // Endpoint for requesting timezone offset
  app.route('/api/sendApplicationLog')
    .get(applicationController.sendApplicationLog)
};
