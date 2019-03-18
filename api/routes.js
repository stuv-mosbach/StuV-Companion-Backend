var router = require('express').Router();
var mongoose = require('mongoose');
var provider = require('../utils/provider');

var course = mongoose.model('course', provider.getCS());
var lecture = mongoose.model('lecture', provider.getLS());
var events = mongoose.model('event', provider.getES());
var plan = mongoose.model('plan', provider.getPS());
var feed = mongoose.model('feed', provider.getFS());

router.get('/', (req, res) => {
  res.json({
    status: 'API online!',
    message: 'Overview of functions:',
    functions: [
      {
        url: "/courses",
        description: "get all courses"
      },
      {
        url: "/lectures/[COURSE]",
        description: "get all lectures for a course given via parameter"
      },
      {
        url: "/events",
        description: "get all events happening in the future"
      },
      {
        url: "/mensaplan",
        description: "get the mensaplan for this week"
      },
      {
        url: "/news",
        description: "get the newsfeed from our website"
      }
    ]
  });
});

router.get('/courses', (req, res) => {
  course.find((err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => response.push(e.course));
    res.json(response);
  });
});

router.get('/lectures/:course', (req, res) => {
  lecture.find({course: req.params.course.toUpperCase()}, (err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => response.push({start: e.dtstart, end: e.dtend, lastModified: e['last-modified'], title: e.summary, description: e.description, location: e.location, course: e.course}));
    if (res == null) res.json({error: "No course found or there are no lectures yet!"});
    else res.json(response);
  });
});

router.get('/events', (req, res) => {
  events.find((err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => response.push({start: e.dtstart, end: e.dtend, lastModified: e['last-modified'],title: e.summary, description: e.description,  location: e.location}));
    res.json(response);
  });
});

router.get('/mensaplan', (req, res) => {
  plan.find((err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => response.push({validUntil: e.validUntil, montag: e.Montag, dienstag: e.Dienstag, mittwoch: e.Mittwoch, donnerstag: e.Donnerstag, freitag: e.Freitag}));
    res.json(response);
  });
});

router.get('/news', (req, res) => {
  feed.find((err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => response.push({title: e.title, description: e.description, url: e.url, created: new Date(e.created)}));
    res.json(response);
  });
});

module.exports = router;
