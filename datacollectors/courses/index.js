var courses = require("./courses");

exports.courses = () => {
  console.log("Courses sync executed!");
   courses.run();
};
