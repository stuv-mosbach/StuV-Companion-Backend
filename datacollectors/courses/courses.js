var axios = require('axios');
var mongo = require('mongodb').MongoClient;

var url_Courses = "http://ics.mosbach.dhbw.de/ics/calendars.list";
var url_DB = "mongodb://localhost:27017/";

var db_env = "Dev";

var data;
var courses = [];

const getData = async url => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data;
    } catch (err) {
        console.log(err);
    }
};

const updateCourses = data => {
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
        if (err) throw new Error(err);
        var dbo = db.db(db_env);
        data.forEach(element => {
            var query = { course: element.course };
            dbo.collection("courses").findOne(query, (err, res) => {
                if (err) throw new Error(err);
                if (res == null) {
                    insertElement(element);
                } else if (res.course != element.course) {
                    updateElement(element);
                }
                db.close();
            });
        });
    });
};

const updateElement = data => {
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
        if (err) throw new Error(err);
        var dbo = db.db(db_env);
        var query = { course: data.course };
        dbo.collection("courses").updateOne(query, { $set: { url: data.url} }, (err, res) => {
            if (err) throw new Error(err);
            // console.log(data.course + " updated");
            db.close();
        });
    });
};

const insertElement = data => {
    mongo.connect(url_DB, { useNewUrlParser: true }, (err, db) => {
        if (err) throw new Error(err);
        var dbo = db.db(db_env);
        dbo.collection("courses").insertOne(data, (err, res) => {
            if (err) throw new Error(err);
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

exports.run = async () => {
    data = await getData(url_Courses);
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
    updateCourses(courses);
};
