var mongo = require('mongodb').MongoClient;
var splitting = require('split-lines');
var crawler = require('crawler-request');
var dbProvider = require('../../utils/db');

var pdfUrl = "https://www.studentenwerk.uni-heidelberg.de/sites/default/files/download/pdf/sp-mos-mensa-aktuell.pdf";
var url_DB = dbProvider.getUrl();

var db_env = dbProvider.getEnv();

var data = [];

const readPDF = (resolve, reject) => {
  crawler(pdfUrl)
    .then((response) => {
    data = splitting(response.text);
    createJSON(resolve, reject);
  })
    .catch((err) => {reject(err)});
};

const createJSON = (resolve, reject) => {
  var monday = [];
  var tuesday = [];
  var wednesday = [];
  var thursday = [];
  var friday = [];
  for(let i = 0; i < data.length; i++) {
      if(data[i] == "Montag: " || data[i] == "Montag ") {
          for(let j = i + 1; j < data.length; j++) {
              if(data[j] == " ") break;
              monday.push(data[j])
          }
      }
      if(data[i] == "Dienstag: " || data[i] == "Dienstag ") {
          for(let k = i + 1; k < data.length; k++) {
              if(data[k] == " ") break;
              tuesday.push(data[k])
          }
      }
      if(data[i] == "Mittwoch: " || data[i] == "Mittwoch ") {
          for(let l = i + 1; l < data.length; l++) {
              if(data[l] == " ") break;
              wednesday.push(data[l])
          }
      }
      if(data[i] == "Donnerstag: " || data[i] == "Donnerstag ") {
          for(let m = i + 1; m < data.length; m++) {
              if(data[m] == " ") break;
              thursday.push(data[m])
          }
      }
      if(data[i] == "Freitag: " || data[i] == "Freitag ") {
          for(let n = i + 1; n < data.length; n++) {
              if(data[n] == " ") break;
              friday.push(data[n])
          }
      }
  }
  var valid = data[5].substr((data[5].length - 11), data[5].length);
  var object = {
    validUntil: valid,
    Montag: monday,
    Dienstag: tuesday,
    Mittwoch: wednesday,
    Donnerstag: thursday,
    Freitag: friday
  };
  updatePlan(object, resolve, reject);
};

const updatePlan = (data, resolve, reject) => {
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
      if (err) reject(err);
      var dbo = db.db(db_env);
        var query = { validUntil: data.validUntil };
        dbo.collection("plans").findOne(query, (err, res) => {
          if (err) throw err;
          if (res == null) {
            insertElement(data, dbo, resolve, reject);
          } else {
            updateElement(data, dbo, resolve, reject);
          }
          db.close();
          resolve();
        });
    });
};

const insertElement = (data, dbo, resolve, reject) => {
        dbo.collection("plans").insertOne(data, (err, res) => {
            if (err) reject(err);
            // console.log(data.validUntil + " inserted");
        });
};

const updateElement = (data, dbo, resolve, reject) => {
        var query = { validUntil: data.validUntil };
        dbo.collection("plans").updateOne(query, { $set: data }, (err, res) => {
            if (err) reject(err);
            // console.log(data.validUntil + " updated");
        });
};

exports.run = async () => {
    return new Promise((resolve, reject) => {
      readPDF(resolve, reject);
    });
};
