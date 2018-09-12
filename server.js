var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/boulder-now/";
app.use(express.static(distDir));

// Create API routes
var eventRoutes = require('./api/routes/eventRoutes');
eventRoutes(app);
var geoServiceRoutes = require('./api/routes/geoServiceRoutes');
geoServiceRoutes(app);

// Initialize the app.
var server = app.listen(process.env.PORT || 4200, () => {
  var port = server.address().port;
  console.log('App now running on port ' + port);
});
