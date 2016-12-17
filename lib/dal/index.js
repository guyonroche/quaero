'use strict';

const MySqlDAL = require('./mysql');

let singleton = null;

class DAL {
  static createDal(config) {
    switch (config.type) {
      case 'mysql':
        singleton = new MySqlDAL(config.mysql);
        break;

      default:
        throw new Error('Invalid DB type: ' + config.type);
    }
    return singleton;
  }

  static getDal() {
    return singleton;
  }
}

module.exports = DAL;