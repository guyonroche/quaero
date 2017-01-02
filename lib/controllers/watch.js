'use strict';

const DAL = require('../dal');

const prune = (obj, fields) => fields.reduce((o, name) => {
  o[name] = obj[name];
  return o;
}, {});

const log = title => value => {
  console.log(title, value);
  return value;
};

class Watch {
  static getWatching(user) {
    let dal = DAL.getDal();
    return dal.getWatches(user.userId, 'watching')
      .then(watching => watching.map(watch => watch.quid));
  }

  static updateWatching(user, quid, active) {
    let dal = DAL.getDal();
    return dal.updateWatch(user.userId, quid, 'watching', active);
  }

  static getViewing(user) {
    let dal = DAL.getDal();
    return dal.getWatches(user.userId, 'viewing')
      .then(viewing => viewing.map(view => view.quid));
  }

  static updateViewing(user, quid, active) {
    let dal = DAL.getDal();
    return dal.updateWatch(user.userId, quid, 'viewing', active);
  }

  static getHistory(user) {
    let dal = DAL.getDal();
    return dal.getWatches(user.userId, 'history');
  }

  static clear(user) {
    let dal = DAL.getDal();
    return dal.clearWatch(user.userId);
  }
}

module.exports = Watch;