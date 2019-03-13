var agenda = require('agenda');
var events = require('../datacollectors/events/events');
var plan = require('../datacollectors/plan/reader');
var lectures = require('../datacollectors/lectures/lectures');
var feed = require('../datacollectors/newsfeed/feed');
var course = require('../datacollectors/courses/courses');
var dbProvider = require('../utils/db');

var url_DB = dbProvider.getUrl() + "agenda";

var agent = new agenda({db: {address: url_DB}});

agent.define('Update StuV-Events', async (job, done) => {
  events.run()
  .then(() => {done();})
  .catch(err => {done(err);});
});

agent.define('Update Mensaplan', async (job, done) => {
  plan.run()
  .then(() => {done();})
  .catch(err => {done(err);});
});

agent.define('Update Vorlesungen', async (job, done) => {
  lectures.run()
  .then(() => {done();})
  .catch(err => {done(err);});
});

agent.define('Update Kurse', async (job, done) => {
  course.run()
    .then(() => {done();})
    .catch(err => {done(err);});
});

agent.define('Update Feed', async (job, done) => {
  feed.run()
  .then(() => {done();})
  .catch(err => {done(err);});
});

agent.on('start', job => {
  console.log('Job %s starting', job.attrs.name);
});

agent.on('complete', job => {
  console.log(`Job ${job.attrs.name} finished`);
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
