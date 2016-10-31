'use strict';

let MySqlDAL = require('./mysql');

let singleton = null;

module.exports = {
  createDal: function createDal(config) {
    switch(config.type) {
      case 'mysql':
        singleton = new MySqlDAL(config.mysql);
        break;
      
      default:
        throw new Error('Invalid DB type: ' + config.type);
    }
    return singleton;
  },
  
  getDal: function() {
    return singleton;
  }
};