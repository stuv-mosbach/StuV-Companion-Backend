var express = require('express');
var agendash = require('agendash');
var scheduler = require('./scheduler/scheduler');
var routes = require('./api/routes');
var mongoose = require('mongoose');
var dbProvider = require('./utils/db');

var dbUrl = dbProvider.getUrl() + dbProvider.getEnv();
var app = express();
var port = 8080;

scheduler.run();

mongoose.connect(dbUrl, { useNewUrlParser: true });
var db = mongoose.connection;

app.use('/dash', agendash(scheduler.get()));

app.use('/api', routes);

app.listen(port, () => {
  console.log("Backend running on port: " + port);
});
