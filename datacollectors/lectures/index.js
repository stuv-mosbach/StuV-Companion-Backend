var lectures = require("./lectures");


exports.lectures = () => {
  console.log("Lectures sync executed!");
  lectures.run();
};
