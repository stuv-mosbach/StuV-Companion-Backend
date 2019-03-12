var mongo = require('mongodb').MongoClient;
var splitting = require('split-lines');
var crawler = require('crawler-request');

var pdfUrl = "https://www.studentenwerk.uni-heidelberg.de/sites/default/files/download/pdf/sp-mos-mensa-aktuell.pdf";
var url_DB = "mongodb://localhost:27017/";

var db_env = "Dev";

var data = [];

const readPDF = () => {
  crawler(pdfUrl).then((response) => {
    data = splitting(response.text);
    createJSON();
});
};

const createJSON = () => {
  var valid = data[5].substr((data[5].length - 11), data[5].length);
  var object = {
    validUntil: valid,
    Montag: [data[12], data[13], data[14], data[15]],
    Dienstag: [data[18], data[19], data[20], data[21]],
    Mittwoch: [data[24], data[25], data[26], data[27]],
    Donnerstag: [data[30], data[31], data[32], data[33]],
    Freitag: [data[36], data[37], data[38], data[39]]
  };
  updatePlan(object);
};

const updatePlan = (data) => {
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
      if (err) throw new Error(err);
      var dbo = db.db(db_env);
        var query = { validUntil: data.validUntil };
        dbo.collection("plans").findOne(query, (err, res) => {
          if (err) throw err;
          if (res == null) {
            insertElement(data, dbo);
          } else {
            updateElement(data, dbo);
          }
          db.close();
        });
    });
};

const insertElement = (data, dbo) => {
        dbo.collection("plans").insertOne(data, (err, res) => {
            if (err) throw new Error(err);
            // console.log(data.validUntil + " inserted");
        });
};

const updateElement = (data, dbo) => {
        var query = { validUntil: data.validUntil };
        dbo.collection("plans").updateOne(query, { $set: data }, (err, res) => {
            if (err) throw new Error(err);
            // console.log(data.validUntil + " updated");
        });
};

exports.run = async () => {
    readPDF();
};
