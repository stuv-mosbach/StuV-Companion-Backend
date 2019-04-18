var url = "mongodb://172.17.0.5:27017/";
var env = "Prod";

exports.getUrl = () => {
    return url;
};

exports.getEnv = () => {
    return env;
}