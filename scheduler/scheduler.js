var agenda = require('agenda');
var events = require('../datacollectors/events/index');
var plan = require('../datacollectors/plan/index');
var lectures = require('../datacollectors/lectures/index');
var feed = require('../datacollectors/newsfeed/index');
var course = require('../datacollectors/courses/index');

var url_DB = "mongodb://localhost:27017/agenda";

var agent = new agenda({db: {address: url_DB}});

agent.define('Update StuV-Events', (job, done) => {
  try {
    events.main();
    done();
  } catch (err) {
    done(err);
  }
});

agent.define('Update Mensaplan', (job, done) => {
  try {
    plan.main();
    done();
  } catch (err) {
    done(err);
  }
});

agent.define('Update Vorlesungen', (job, done) => {
  try {
    lectures.lectures();
    done();
  } catch (err) {
    done(err);
  }
});

agent.define('Update Kurse', (job, done) => {
  try {
    course.courses();
    done();
  } catch (err) {
    done(err);
  }
});

agent.define('Update Feed', (job, done) => {
  try {
    feed.main();
    done();
  } catch (err) {
    done(err);
  }
});

exports.get = () => {
  return agent;
};

exports.run = async () => {
  await agent.start();
  await agent.every('15 minutes', ['Update StuV-Events', 'Update Feed']);
  await agent.every('1 hour', 'Update Vorlesungen');
  await agent.every('1 day', ['Update Mensaplan', 'Update Kurse']);
};
