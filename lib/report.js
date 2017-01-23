'use strict';

const Model = require('./model');
const helpers = require('./helpers');

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
};
