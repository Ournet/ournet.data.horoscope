'use strict';

const Model = require('./model');
const helpers = require('./helpers');
const utils = require('./utils');
const Promise = utils.Promise;
const _ = utils._;

module.exports = class Report extends Model {
	constructor(db) {
		super(db, 'Report');
	}

	normalize(data) {
		return helpers.normalizeReport(data);
	}

	static createId() {
		return helpers.createReportId.apply(null, arguments);
	}

	/**
	 * Generates a Horoscope for a given lang, date & sign
	 * @param  {Phrase} phraseModel Phrase model
	 * @param  {Object} data        DayHoroscope data
	 * @return {Object}             Created day horoscope
	 */
	generate(phraseModel, data, options, iteration) {
		const self = this;
		iteration = iteration || 0;
		options = _.defaults({}, options);
		options = _.defaults(options, { minPhrases: 1, maxPhrases: 3 });
		return phraseModel.count({ lang: data.lang, sign: data.sign })
			.then(totalPhrases => {
				if (totalPhrases < 50) {
					return Promise.reject(new Error('Too few phrases'));
				}
				const limit = utils.randomInt(options.minPhrases, options.maxPhrases);
				const offset = utils.randomInt(0, totalPhrases - limit);

				return phraseModel.list({
						where: {
							lang: data.lang,
							sign: data.sign
						},
						limit: limit,
						offset: offset
					})
					.then(phrases => {

						data.text = phrases.map(item => {
							return item.text;
						}).join('\n');

						data.phrasesIds = phrases.map(item => {
							return item.id;
						});

						return self.create(data).catch(e => {
							if (iteration < 3) {
								return self.generate(phraseModel, data, options, ++iteration);
							}
							return Promise.reject(e);
						});
					});
			});
	}
};
