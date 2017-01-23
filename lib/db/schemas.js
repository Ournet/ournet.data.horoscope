'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const util = require('util');
const utils = require('../utils');
const TABLE_PREFIX = process.env.HOROSCOPE_TABLE_PREFIX || 'horoscope';

/**
 * Base schema
 */
function BaseSchema() {
	Schema.apply(this, arguments);

	if (!this.paths.createdAt) {
		this.add({
			createdAt: {
				type: Date,
				default: Date.now
			}
		});
	}
	if (!this.paths.updatedAt) {
		this.add({
			updatedAt: {
				type: Date
			}
		});
	}

	this.pre('save', function(next) {
		this.updatedAt = Date.now();
		next();
	});
}

util.inherits(BaseSchema, Schema);

/**
 * Phrase schema
 */
const Phrase = exports.Phrase = new BaseSchema({
	// hash(text)
	_id: String,
	text: {
		type: String,
		trim: true,
		minlength: 100,
		maxlength: 1000,
		required: true
	},
	sign: {
		type: Number,
		min: 1,
		max: 12,
		required: true,
		index: true
	},
	source: {
		type: String,
		lowercase: true,
		trim: true,
		minlength: 1,
		maxlength: 50,
		required: true
	},
	lang: {
		type: String,
		trim: true,
		lowercase: true,
		length: 2,
		index: true,
		required: true
	},
	length: {
		type: Number,
		min: 1,
		required: true
	},
	rand: {
		type: Number,
		index: true,
		required: true,
		default: utils.randomInt
	},
	period: {
		type: String,
		enum: ['D', 'W'],
		required: true
	}

}, {
	collection: [TABLE_PREFIX, 'phrases'].join('_')
});

/**
 * Phrase schema
 */
const Report = exports.Report = new BaseSchema({
	// PERIOD LANG SIGN join
	_id: String,
	text: {
		type: String,
		trim: true,
		minlength: 100,
		maxlength: 2000,
		required: true
	},
	// D20170115, Y2017, M201701, W201710
	period: {
		type: String,
		required: true,
		index: true,
		minlength: 1,
		maxlength: 50,
		uppercase: true,
		trim: true
	},
	sign: {
		type: Number,
		min: 1,
		max: 12,
		required: true,
		index: true
	},
	phrasesIds: {
		type: [String],
		required: true,
		minlength: 1,
		maxlength: 10
	},
	lang: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		length: 2,
		index: true
	},
	length: {
		type: Number,
		min: 100,
		required: true
	},
	textHash: {
		type: String,
		required: true,
		unique: true,
		minlength: 32,
		maxlength: 40
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	expiresAt: {
		type: Date,
		// default: Date.now,
		required: true,
		expires: '7d'
	}
}, {
	collection: [TABLE_PREFIX, 'reports'].join('_')
});

Phrase.set('toObject', {
	getters: true
});

Report.set('toObject', {
	getters: true
});
