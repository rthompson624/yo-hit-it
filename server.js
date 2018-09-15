var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Redirect http to https in production only
var env = process.env.NODE_ENV;
if (env === 'production') {
  app.use(function (req, res, next) {
    if (req.headers['x-forwarded-proto'] != 'https') {
      res.redirect(301, 'https://' + req.headers.host + req.url);
    } else {
      return next();
    }
  });
}

// Create link to Angular build directory
var distDir = __dirname + "/dist/boulder-now/";
app.use(express.static(distDir));

// Create API routes
var eventRoutes = require('./api/routes/eventRoutes');
eventRoutes(app);
var geoServiceRoutes = require('./api/routes/geoServiceRoutes');
geoServiceRoutes(app);
var applicationRoutes = require('./api/routes/applicationRoutes');
applicationRoutes(app);

// Initialize the app.
var server = app.listen(process.env.PORT || 4200, () => {
  var port = server.address().port;
  console.log('App now running on port ' + port);
});
