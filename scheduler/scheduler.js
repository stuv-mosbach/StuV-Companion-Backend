var agenda = require('agenda');
var events = require('../datacollectors/events/events');
var plan = require('../datacollectors/plan/index');
var lectures = require('../datacollectors/lectures/lectures');
var feed = require('../datacollectors/newsfeed/feed');
var course = require('../datacollectors/courses/courses');

var url_DB = "mongodb://localhost:27017/agenda";

var agent = new agenda({db: {address: url_DB}});

agent.define('Update StuV-Events', async (job, done) => {
  try {
    await events.run();
    done();
  } catch (err) {
    done(err);
  }
});

agent.define('Update Mensaplan', async (job, done) => {
  try {
    await plan.main();
    done();
  } catch (err) {
    done(err);
  }
});

agent.define('Update Vorlesungen', async (job, done) => {
  try {
    await lectures.run();
    done();
  } catch (err) {
    done(err);
  }
});

agent.define('Update Kurse', async (job, done) => {
  try {
    await course.run();
    done();
  } catch (err) {
    done(err);
  }
});

agent.define('Update Feed', async (job, done) => {
  try {
    await feed.run();
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
