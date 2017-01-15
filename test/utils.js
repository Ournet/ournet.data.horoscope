'use strict';

const utils = require('../lib/utils');
const assert = require('assert');

describe('utils', function() {
	it('#randomInt', function() {
		const r1 = utils.randomInt();
		const r2 = utils.randomInt();

		// console.log(r1, r2);

		assert.equal(false, r1 === r2);
	});
});
