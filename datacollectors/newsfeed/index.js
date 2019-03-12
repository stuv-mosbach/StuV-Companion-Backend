var feed = require('./feed');

exports.main = () => {
  console.log("Feed sync executed!");
  feed.run();
};
