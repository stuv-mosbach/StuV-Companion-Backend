var mongo = require('mongodb').MongoClient;
var icalhelp = require('./ical-helper');

var url_DB = "mongodb://localhost:27017/";

var db_env = "Dev";

var courses;
var mainCounter = 0;

const compJson = (obj1, obj2) => {
  var flag=true;
  keys1 = Object.keys(obj1);
  keys2 = Object.keys(obj2);
  keys1.sort();
  keys2.sort();
  if (keys1.length == keys2.length) {
    for(k in keys1) {
      if (obj1[k] == obj2[k]) {
        continue;
      } else {
        flag = false;
        break;
      }
    }
  } else {
    flag = false;
  }
  return flag;
};

const loadCourses = (resolve, reject) => {
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
        if (err) reject(err);
        var dbo = db.db(db_env);
        dbo.collection("courses").find({}).toArray((err, res) => {
            if (err) reject(err);
            courses = res;
            db.close();
            updateLectures(resolve, reject);
        });
    });
};

const updateElement = (data, dbo, resolve, reject) => {
        var query = { uid: data.uid };
        dbo.collection("lectures").updateOne(query, { $set: data }, (err, res) => {
            if (err) reject(err);
            // console.log(data.course + " lecture: " + data.uid + " updated");
        });
};

const updateCourse = (data, name, resolve, reject) => {
    data.events.forEach(e => e.course = name);
    data.events.shift();
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
      if (err) reject(err);
      var dbo = db.db(db_env);
      var counter = 0;
      data.events.forEach(e => {
        var query = { uid: e.uid };
        dbo.collection("lectures").findOne(query, (err, res) => {
          if (err) reject(err);
          counter++;
          if (res == null) {
            insertElement(e, dbo, resolve, reject);
          } else {
            e._id = res._id;
            if(!compJson(e, res)) updateElement(e, dbo, resolve, reject);
          }
          if (counter >= data.events.length) {
            db.close();
            mainCounter++;
        }
          if(mainCounter >= courses.length) {
            resolve();
          }
        });
      });
    });
};

const insertElement = (data, dbo, resolve, reject) => {
        dbo.collection("lectures").insertOne(data, (err, res) => {
            if (err) reject(err);
            // console.log(data.course + " lecture: " + data.uid + " inserted");
        });
};

const updateLectures = (resolve, reject) => {
    courses.forEach(e => {
        icalhelp.main(e.url)
            .then((res) => updateCourse(res, e.course, resolve, reject))
            .catch(err => reject(err));
    });
};

exports.run = () => {
  return new Promise((resolve, reject) => {
    loadCourses(resolve, reject);
  });
};
