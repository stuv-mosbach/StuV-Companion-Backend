var mongo = require('mongodb').MongoClient;
var icalhelp = require('./ical-helper');

var url_DB = "mongodb://localhost:27017/";

var db_env = "Dev";

var courses;

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

const loadCourses = () => {
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
        if (err) throw new Error(err);
        var dbo = db.db(db_env);
        dbo.collection("courses").find({}).toArray((err, res) => {
            if (err) throw new Error(err);
            courses = res;
            db.close();
            updateLectures();
        });
    });
};

const updateElement = (data, dbo) => {
        var query = { uid: data.uid };
        dbo.collection("lectures").updateOne(query, { $set: data }, (err, res) => {
            if (err) throw new Error(err);
            // console.log(data.course + " lecture: " + data.uid + " updated");
        });
};

const updateCourse = (data, name) => {
    data.events.forEach(e => e.course = name);
    data.events.shift();
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
      if (err) throw new Error(err);
      var dbo = db.db(db_env);
      var counter = 0;
      data.events.forEach(e => {
        var query = { uid: e.uid };
        dbo.collection("lectures").findOne(query, (err, res) => {
          if (err) throw new Error(err);
          counter++;
          if (res == null) {
            insertElement(e, dbo);
          } else {
            e._id = res._id;
            if(!compJson(e, res)) updateElement(e, dbo);
          }
          if (counter >= data.events.length) db.close();
        });
      });
    });
};

const insertElement = (data, dbo) => {
        dbo.collection("lectures").insertOne(data, (err, res) => {
            if (err) throw new Error(err);
            // console.log(data.course + " lecture: " + data.uid + " inserted");
        });
};

const updateLectures = () => {
    courses.forEach(e => {
        icalhelp.main(e.url)
            .then(res => updateCourse(res, e.course));
    });
};

exports.run = () => {
    loadCourses();
};
