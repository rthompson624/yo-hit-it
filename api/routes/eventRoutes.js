'use strict';

module.exports = function(app) {
  var eventController = require('../controllers/eventController');

  // Endpoint for requesting events
  app.route('/api/getEvents')
    .get(eventController.getEvents)
};
