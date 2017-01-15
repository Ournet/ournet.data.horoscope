'use strict';

const utils = require('./utils');
const _ = utils._;

exports.createDayHoroscopeId = function(data) {
	return [data.date.toString(), data.lang.toLowerCase().trim(), data.sign.toString()].join('');
};

exports.normalizeDayHoroscope = function(data) {
	data = _.clone(data);

	data.text = data.text.trim();
	data.length = data.text.length;
	data._id = exports.createDayHoroscopeId(data);

	return data;
};

exports.createPhraseId = function(text) {
	text = text.split('').filter(item => {
		return item === ' ' || utils.isLetter(item) || utils.isDigit(item);
	}).join('');
	return utils.md5([text.trim().toLowerCase()].join('|'));
};

exports.normalizePhrase = function(data) {
	data = _.clone(data);

	data.text = data.text.trim().replace(/[\r]/g, '').replace(/\n\s+/g, '\n').replace(/\s+\n/g, '\n').replace(/ {2,}/g, ' ');
	data.length = data.text.length;

	data._id = exports.createPhraseId(data.text);

	return data;
};
