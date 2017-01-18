'use strict';

const Phrase = require('./phrase');
const Report = require('./report');
const db = require('./db');
const mongoose = require('mongoose');
const signsNames = require('./signs_names.json');

exports.signsNames = signsNames;
exports.mongoose = mongoose;
exports.Phrase = Phrase;
exports.Report = Report;
exports.db = db;

exports.connect = (connectionString, options, cb) => {
	return mongoose.createConnection(connectionString, options, cb);
};
