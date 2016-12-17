'use strict';

const DAL = require('../dal');

const log = title => value => {
  console.log(title, value);
  return value;
};

class Watch {
  static getWatching(user) {
    let dal = DAL.getDal();
    return dal.getWatches(user.userId, 'watching');
  }

  static updateWatching(user, quid, active) {
    let dal = DAL.getDal();
    return dal.updateWatch(user.userId, quid, 'watching', active);
  }

  static getViewing(user) {
    let dal = DAL.getDal();
    return dal.getWatches(user.userId, 'viewing');
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