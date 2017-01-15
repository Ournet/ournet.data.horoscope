'use strict';

const Model = require('./model');
const helpers = require('./helpers');

module.exports = class Phrase extends Model {
  constructor(db) {
    super(db, 'Phrase');
  }

  normalize(data) {
    return helpers.normalizePhrase(data);
  }

  static createId() {
    return helpers.createPhraseId.apply(null, arguments);
  }
};
