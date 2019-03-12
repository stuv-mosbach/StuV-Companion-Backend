var events = require('./events');

exports.main = () => {
  console.log("Event sync executed!");
  events.run();
};
