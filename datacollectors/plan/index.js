var reader = require('./reader');

exports.main = () => {
  console.log("Mensa sync executed!");
  reader.run();
};
