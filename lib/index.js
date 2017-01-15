'use strict';

const Phrase = require('./phrase');
const DayHoroscope = require('./day_horoscope');
const db = require('./db');
const mongoose = require('mongoose');

exports.mongoose = mongoose;
exports.Phrase = Phrase;
exports.DayHoroscope = DayHoroscope;
exports.db = db;
exports.connect = (connectionString, options, cb) => {
  return mongoose.createConnection(connectionString, options, cb);
};
