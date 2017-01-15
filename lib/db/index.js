'use strict';

const schemas = require('./schemas');
const utils = require('../utils');
const Promise = utils.Promise;
const models = require('../model').models();

module.exports = function(connection) {
  const db = {};
  models.forEach(function(model) {
    const m = db[model] = connection.model(model, schemas[model]);
    Promise.promisifyAll(m);
    Promise.promisifyAll(m.prototype);
  });

  return db;
};
