var axios = require('axios');
var mongo = require('mongodb').MongoClient;

var url_Courses = "http://ics.mosbach.dhbw.de/ics/calendars.list";
var url_DB = "mongodb://localhost:27017/";

var db_env = "Dev";

var data;
var courses = [];

const getData = (url, resolve, reject) => {
    axios.get(url)
      .then((res) => {
        var data = res.data;
        var lines = data.split('\n');
        lines.forEach(element => {
            var entry = element.split(';');
            var toAdd = {
                course: entry[0],
                url: entry[1]
            };
            courses.push(toAdd);
        });
        courses = cleanUp(courses);
        updateCourses(courses, resolve, reject);
        //resolve(); //todo: Chain promise to every error else i am fucked!
      })
      .catch((err) => {
        reject(err);
      });
};

const updateCourses = (data, resolve, reject) => {
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
        if (err) reject(err);
        var dbo = db.db(db_env);
        data.forEach(element => {
            var query = { course: element.course };
            dbo.collection("courses").findOne(query, (err, res) => {
                if (err) reject(err);
                if (res == null) {
                    insertElement(element, resolve, reject);
                } else if (res.course != element.course) {
                    updateElement(element, resolve, reject);
                }
                db.close();
            });
        });
        resolve();
    });
};

const updateElement = (data, resolve, reject) => {
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
        if (err) reject(err);
        var dbo = db.db(db_env);
        var query = { course: data.course };
        dbo.collection("courses").updateOne(query, { $set: { url: data.url} }, (err, res) => {
            if (err) reject(err);
            // console.log(data.course + " updated");
            db.close();
        });
    });
};

const insertElement = (data, resolve, reject) => {
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
        if (err) reject(err);
        var dbo = db.db(db_env);
        dbo.collection("courses").insertOne(data, (err, res) => {
            if (err) reject(err);
            // console.log(data.course + " inserted");
            db.close();
        });
    });
};

const cleanUp = data => {
    const year = (new Date()).getFullYear().toString().substr(2);
    var result = [];
    data.forEach(element => {
        const dt = element.course.match(/\d+/g);
        if(dt != null && dt[0] > (year - 4)) result.push(element);
    });
    return result;
};

exports.run = () => {
  return new Promise((resolve, reject) => {
    getData(url_Courses, resolve, reject);
  });
};
