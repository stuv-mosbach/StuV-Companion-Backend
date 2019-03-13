var icalhelp = require('../lectures/ical-helper');
var mongo = require('mongodb').MongoClient;
var datehelper = require('./dateParser');
var dbProvider = require('../../utils/db');

var calendar_url = "https://calendar.google.com/calendar/ical/asta.dhbw.de_08mkcuqcrppq8cg8vlutdsgpjg%40group.calendar.google.com/public/basic.ics";

var url_DB = dbProvider.getUrl();

var db_env = dbProvider.getEnv();
var mainCounter = 0;

const getEvents = (resolve, reject) => {
  icalhelp.main(calendar_url)
    .then(res => {
      //console.log(res);
      updateEvents(res, resolve, reject);
    })
    .catch((err) => {reject(err)});
};
const checkIfInPast = (date) => {
    var dateIn = datehelper.iCalDateParser(date);
    var now = new Date();
    return((dateIn > now));
};

const updateEvents = (data, resolve, reject) => {
  mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
    if (err) reject(err);
    var dbo = db.db(db_env);
    var counter = 0;
    data.events.forEach(e => {
      var query = { uid: e.uid };
      dbo.collection("events").findOne(query, (err, res) => {
        if (err) reject(err);
        counter++;
        if (res == null) {
          insertElement(e, dbo, resolve, reject);
        } else if (res['last-modified'] != e['last-modified']) {
          updateElement(e, dbo, resolve, reject);
        }
        if (counter >= data.events.length) {
          db.close();
          resolve();
        }
      });
    });
  });
};

const updateElement = (data, dbo, resolve, reject) => {
        var query = { uid: data.uid };
        dbo.collection("events").updateOne(query, { $set: data }, (err, res) => {
            if (err) reject(err);
            // console.log(data.summary + " updated");
        });
};

const insertElement = (data, dbo, resolve, reject) => {
  if(checkIfInPast(data.dtend)) {
    dbo.collection("events").insertOne(data, (err, res) => {
        if (err) reject(err);
        // console.log(data.summary + " inserted");
    });
  };
};

exports.run = () => {
  return new Promise((resolve, reject) => {
    getEvents(resolve, reject);
  });
};
