'use strict';

module.exports = function(app) {
  var geoServiceController = require('../controllers/geoServiceController');

  // Endpoint for requesting timezone offset
  app.route('/api/getUtcOffset')
    .get(geoServiceController.getUtcOffset)
};
