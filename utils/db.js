var url = "mongodb://172.19.0.2:27017/";
var env = "Prod";

exports.getUrl = () => {
    return url;
};

exports.getEnv = () => {
    return env;
}