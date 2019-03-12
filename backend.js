var express = require('express');
var agendash = require('agendash');
var scheduler = require('./scheduler/scheduler');

var app = express();
var port = 8080;

scheduler.run();

app.use('/dash', agendash(scheduler.get()));

app.listen(port, () => {
  console.log("Backend running on port: " + port);
});
