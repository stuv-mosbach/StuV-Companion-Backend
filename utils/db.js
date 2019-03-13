var url = "mongodb://localhost:27017/";
var env = "Dev";

exports.getUrl = () => {
  return url;
};

exports.getEnv = () => {
  return env;
}
