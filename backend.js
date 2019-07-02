require('dotenv').config();
var express = require('express');
var agendash = require('agendash');
var scheduler = require('./scheduler/scheduler');
var routes = require('./api/routes');
var mongoose = require('mongoose');
var dbProvider = require('./utils/db');
var cors = require('cors');
var basicAuth = require('express-basic-auth');
var swaggerUI = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

var dbUrl = dbProvider.getUrl() + dbProvider.getEnv();
var app = express();
var port = 8090;

scheduler.run();

mongoose.connect(dbUrl, { useNewUrlParser: true });
var db = mongoose.connection;

app.use(cors());

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/dash', basicAuth({
    users: {
        admin: process.env.ADMIN_PW,
    },
    challenge: true,
    realm: 'stuvbackendadmin',
}), agendash(scheduler.get()));

app.use('/api', routes);

app.listen(port, () => {
    console.log("Backend running on port: " + port);
});

//agendash(scheduler.get())