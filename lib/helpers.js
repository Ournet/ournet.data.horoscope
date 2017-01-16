'use strict';

const utils = require('./utils');
const _ = utils._;
const atonic = require('atonic');

exports.createReportId = function(data) {
	return [data.period.toUpperCase(), data.lang.toUpperCase().trim(), data.sign.toString()].join('');
};

exports.normalizeReport = function(data) {
	data = _.clone(data);

	data.period = data.period.toUpperCase();

	if (!/^[YMWD]\d{4,8}$/.test(data.period)) {
		throw new Error('Invalid horoscope report `period`');
	}

	data.text = data.text.trim();
	data.length = data.text.length;
	data._id = exports.createReportId(data);

	data.textHash = utils.md5(data.phrasesIds.sort().join(','));

	return data;
};

exports.createPhraseId = function(text) {
	text = text.split('').filter(item => {
		return item === ' ' || utils.isLetter(item) || utils.isDigit(item);
	}).join('');

	text = atonic(text);

	return utils.md5([text.trim().toLowerCase()].join('|'));
};

exports.normalizePhrase = function(data) {
	data = _.clone(data);

	data.text = data.text.trim()
		.replace(/[\r]/g, '')
		.replace(/\n\s+/g, '\n')
		.replace(/\s+\n/g, '\n')
		.replace(/ {2,}/g, ' ');

	data.length = data.text.length;

	data._id = exports.createPhraseId(data.text);

	return data;
};
