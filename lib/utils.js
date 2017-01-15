/*eslint no-underscore-dangle:0*/
'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const crypto = require('crypto');

function sha1(value) {
  return crypto.createHash('sha1').update(value, 'utf8').digest('hex').toLowerCase();
}

function md5(value) {
  return crypto.createHash('md5').update(value, 'utf8').digest('hex').toLowerCase();
}

function isNull(target) {
  return [undefined, null].indexOf(target) > -1;
}

function isNotNull(target) {
  return !isNull(target);
}

function isLetter(target) {
  return target.toUpperCase() !== target.toLowerCase();
}

function isDigit(target) {
  return /^\d+$/.test(target);
}

function mongoGetItem(data, nofields) {

  function mapItem(item) {
    return mongoGetItem(item, nofields);
  }

  const _id = data._id;

  data = isNotNull(data.toObject) ? data.toObject() : data;
  for (let prop in data) {
    if (prop === 'id' && _.isNumber(_id)) {
      data[prop] = parseInt(data[prop]);
    } else if (data[prop] === null || nofields.indexOf(prop) > -1) {
      delete data[prop];
    } else if (Array.isArray(data[prop])) {
      data[prop] = data[prop].map(mapItem);
    }
  }
  return data;
}

function mongoGet(data, nofields) {
  nofields = nofields || ['_id', '__v'];
  if (!Array.isArray(nofields)) {
    nofields = [nofields];
  }

  if (data && data.toObject) {
    return mongoGetItem(data, nofields);
  }
  if (data && Array.isArray(data)) {
    return data.map(function(item) {
      return mongoGetItem(item, nofields);
    });
  }
  return data;
}

function getRandomInt(min, max) {
  min = min || 1;
  max = max || 99999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.mongoGet = mongoGet;
exports.isNotNull = isNotNull;
exports.isNull = isNull;
exports.Promise = Promise;
exports._ = _;
exports.sha1 = sha1;
exports.md5 = md5;
exports.randomInt = getRandomInt;
exports.isDigit = isDigit;
exports.isLetter = isLetter;
