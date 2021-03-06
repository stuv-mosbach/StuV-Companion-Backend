var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema({
  course: String,
  url: String
});

var eventSchema = new Schema({
  dtstart: String,
  dtend: String,
  dtstamp: String,
  uid: String,
  created: String,
  description: String,
  'last-modified': String,
  sequence: Number,
  status: String,
  summary: String,
  location: String,
  transp: String
});

var feedSchema = new Schema({
  creator: String,
  title: String,
  link: String,
  pubDate: String,
  'content:encoded': String,
  'dc:creator': String,
  content: String,
  contentSnippet: String,
  guid: String,
  isoDate: String
});

var lectureSchema = new Schema({
  uid: String,
  dtstamp: String,
  dtstart: String,
  class: String,
  created: String,
  description: String,
  'last-modified': String,
  location: String,
  summary: String,
  dtend: String,
  course: String
});

var planSchema = new Schema({
  validUntil: String,
  Montag: [String],
  Dienstag: [String],
  Mittwoch: [String],
  Donnerstag: [String],
  Freitag: [String],
});

exports.getCS = () => {return courseSchema};
exports.getES = () => {return eventSchema};
exports.getFS = () => {return feedSchema};
exports.getLS = () => {return lectureSchema};
exports.getPS = () => {return planSchema};
