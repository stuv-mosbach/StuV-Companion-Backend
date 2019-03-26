var mongoose = require('mongoose');

const cleanUp = (resolve, reject) => {
  mongoose.connection.db.dropCollection('plans', (err, res) => {
    if (err) reject(err);
    resolve();
  })
};

exports.run = () => {
  return new Promise((resolve, reject) => {
    cleanUp(resolve, reject);
  });
};
