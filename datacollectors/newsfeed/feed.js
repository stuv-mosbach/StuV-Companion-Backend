var reader = require('rss-to-json');
var mongo = require('mongodb').MongoClient;

var feedUrl = "https://stuv-mosbach.de/feedsy/";
var url_DB = "mongodb://localhost:27017/";

var db_env = "Dev";

const loadFeed = url => {
  reader.load(url, (err, res) => {
    if (err) throw new Error(err);
    updateEvents(res);
  });
};

const updateEvents = (data) => {
  mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
    if (err) throw new Error(err);
    var dbo = db.db(db_env);
    var counter = 0;
    data.items.forEach(e => {
      var query = { title: e.title };
      dbo.collection("feeds").findOne(query, (err, res) => {
        if (err) throw new Error(err);
        counter++;
        if (res == null) {
          insertElement(e, dbo);
        } else if (res.description != e.description) {
          updateElement(e, dbo);
        }
        if (counter >= data.items.length) db.close();
      });
    });
  });
};

const updateElement = (data, dbo) => {
        var query = { title: data.title };
        dbo.collection("feeds").updateOne(query, { $set: data }, (err, res) => {
            if (err) throw new Error(err);
            // console.log(data.title + " updated");
        });
};

const insertElement = (data, dbo) => {
    dbo.collection("feeds").insertOne(data, (err, res) => {
        if (err) throw new Error(err);
        // console.log(data.title + " inserted");
    });
};


exports.run = () => {
  loadFeed(feedUrl);
};
