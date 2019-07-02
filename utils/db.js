var url = process.env.DB_HOST;
var env = "Prod";

exports.getUrl = () => {
    return url;
};

exports.getEnv = () => {
    return env;
}