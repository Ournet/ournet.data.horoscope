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
		maxlength: 500,
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
		max: 500,
		required: true
	},
	rand: {
		type: Number,
		index: true,
		required: true,
		default: utils.randomInt
	}

}, {
	collection: [TABLE_PREFIX, 'phrases'].join('_')
});

/**
 * Phrase schema
 */
const DayHoroscope = exports.DayHoroscope = new BaseSchema({
	// DATE LANG SIGN join
	_id: String,
	text: {
		type: String,
		trim: true,
		minlength: 100,
		maxlength: 2000,
		required: true
	},
	date: {
		type: Number,
		required: true,
		index: true,
		min: 20170101
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
		min: 1,
		max: 2000,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
		expires: '7d'
	}

}, {
	collection: [TABLE_PREFIX, 'dayhoroscopes'].join('_')
});

Phrase.set('toObject', {
	getters: true
});

DayHoroscope.set('toObject', {
	getters: true
});
