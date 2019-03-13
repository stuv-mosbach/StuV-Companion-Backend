var reader = require('rss-to-json');
var mongo = require('mongodb').MongoClient;
var dbProvider = require('../../utils/db');

var feedUrl = "https://stuv-mosbach.de/feed/";
var url_DB = dbProvider.getUrl();

var db_env = dbProvider.getEnv();

const loadFeed = (url, resolve, reject) => {
  reader.load(url, (err, res) => {
    if (err) reject(err);
    updateEvents(res, resolve, reject);
  });
};

const updateEvents = (data, resolve, reject) => {
  mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
    if (err) reject(err);
    var dbo = db.db(db_env);
    var counter = 0;
    data.items.forEach(e => {
      var query = { title: e.title };
      dbo.collection("feeds").findOne(query, (err, res) => {
        if (err) reject(err);
        counter++;
        if (res == null) {
          insertElement(e, dbo, resolve, reject);
        } else if (res.description != e.description) {
          updateElement(e, dbo, resolve, reject);
        }
        if (counter >= data.items.length) {
          db.close();
          resolve();
        }
      });
    });
  });
};

const updateElement = (data, dbo, resolve, reject) => {
        var query = { title: data.title };
        dbo.collection("feeds").updateOne(query, { $set: data }, (err, res) => {
            if (err) reject(err);
            // console.log(data.title + " updated");
        });
};

const insertElement = (data, dbo, resolve, reject) => {
    dbo.collection("feeds").insertOne(data, (err, res) => {
        if (err) reject(err);
        // console.log(data.title + " inserted");
    });
};


exports.run = () => {
  return new Promise((resolve, reject) => {
    loadFeed(feedUrl, resolve, reject);
  });
};
