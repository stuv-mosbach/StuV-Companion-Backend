var icalhelp = require('../lectures/ical-helper');
var mongo = require('mongodb').MongoClient;
var datehelper = require('./dateParser');

var calendar_url = "https://calendar.google.com/calendar/ical/asta.dhbw.de_08mkcuqcrppq8cg8vlutdsgpjg%40group.calendar.google.com/public/basic.ics";

var url_DB = "mongodb://localhost:27017/";

var db_env = "Dev";

const getEvents = () => {
  icalhelp.main(calendar_url)
    .then(res => {
      //console.log(res);
      updateEvents(res);
    });
};
const checkIfInPast = (date) => {
    var dateIn = datehelper.iCalDateParser(date);
    var now = new Date();
    return((dateIn > now));
};

const updateEvents = (data) => {
  mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
    if (err) throw new Error(err);
    var dbo = db.db(db_env);
    var counter = 0;
    data.events.forEach(e => {
      var query = { uid: e.uid };
      dbo.collection("events").findOne(query, (err, res) => {
        if (err) throw new Error(err);
        counter++;
        if (res == null) {
          insertElement(e, dbo);
        } else if (res['last-modified'] != e['last-modified']) {
          updateElement(e, dbo);
        }
        if (counter >= data.events.length) db.close();
      });
    });
  });
};

const updateElement = (data, dbo) => {
        var query = { uid: data.uid };
        dbo.collection("events").updateOne(query, { $set: data }, (err, res) => {
            if (err) throw new Error(err);
            // console.log(data.summary + " updated");
        });
};

const insertElement = (data, dbo) => {
  if(checkIfInPast(data.dtend)) {
    dbo.collection("events").insertOne(data, (err, res) => {
        if (err) throw new Error(err);
        // console.log(data.summary + " inserted");
    });
  };
};

exports.run = () => {
  getEvents();
};
