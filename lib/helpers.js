'use strict';

const utils = require('./utils');
const _ = utils._;
const atonic = require('atonic');
const standard = require('standard-text');

exports.createReportId = function(data) {
	return [data.period.toUpperCase(), data.lang.toUpperCase().trim(), data.sign.toString()].join('');
};

exports.normalizeReport = function(data) {
	data = _.clone(data);

	data.period = data.period.toUpperCase();

	if (!/^[YMWD]\d{4,8}$/.test(data.period)) {
		throw new Error('Invalid horoscope report `period`');
	}

	if (!data.expiresAt) {
		const pw = data.period[0];
		let ms = Date.now();
		switch (pw) {
			case 'D':
				ms += 1000 * 86400 * 1;
				break;
			case 'W':
				ms += 1000 * 86400 * 14;
				break;
			case 'M':
				ms += 1000 * 86400 * 32;
				break;
			case 'Y':
				ms += 1000 * 86400 * 366;
				break;
		}
		data.expiresAt = new Date(ms);
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

	data.text = standard(data.text, data.lang.toLowerCase());

	data.length = data.text.length;

	data._id = exports.createPhraseId(data.text);

	return data;
};
