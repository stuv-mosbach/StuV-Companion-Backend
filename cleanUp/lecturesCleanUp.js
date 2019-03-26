var mongoose = require('mongoose');

const cleanUp = (resolve, reject) => {
  mongoose.connection.db.dropCollection('lectures', (err, res) => {
    if (err) reject(err);
    resolve();
  })
};

exports.run = () => {
  return new Promise((resolve, reject) => {
    cleanUp(resolve, reject);
  });
};
