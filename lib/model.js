'use strict';

const utils = require('./utils');
const _ = utils._;
const Promise = utils.Promise;
const get = utils.mongoGet;
const assert = require('assert');

const MODELS = ['Phrase', 'DayHoroscope'];

function checkModel(model) {
  if (MODELS.indexOf(model) < 0) {
    throw new Error('Invalid model: ' + model);
  }
}

module.exports = class Model {
  constructor(db, name) {
    checkModel(name);
    this.db = db;
    this.name = name;
  }

  static models() {
    return MODELS;
  }

  create(data) {
    assert.ok(data);

    data = this.normalize(data);

    return this.db[this.name].createAsync(data).then(get);
  }

  normalize(data) {
    return data;
  }

  update(data) {
    assert.ok(data);

    data.updatedAt = data.updatedAt || new Date();
    return this.db[this.name].findByIdAndUpdateAsync(data.id, data).then(get);
  }

  remove(params) {
    assert.ok(params);

    return this.db[this.name].removeAsync(params.where).then(get);
  }

  one(params) {
    assert.ok(params);

    return this.db[this.name].findOneAsync(params.where, params.select).then(get);
  }

  count(where) {
    return this.db[this.name].countAsync(where);
  }

  list(params) {
    assert.ok(params);

    const limit = 10;
    params = _.pick(params, 'where', 'limit', 'order', 'select', 'offset');
    if (params.limit && (params.limit < 1 || params.limit > 200)) {
      delete params.limit;
    }

    const sort = [];
    if (_.isString(params.order)) {
      params.order.split(/[ ,;]+/g).forEach((name) => {
        if (name.length < 2) {
          return;
        }
        if (name[0] === '-') {
          sort.push([name.substr(1), -1]);
        } else {
          sort.push([name, 1]);
        }
      });
    }

    return new Promise((resolve, reject) => {
      this.db[this.name]
        .find(params.where)
        .select(params.select)
        .sort(sort)
        .skip(params.offset || 0)
        .limit(params.limit || limit)
        .exec((error, list) => {
          if (error) {
            return reject(error);
          }
          list = get(list);
          resolve(list);
        });
    });
  }
};
