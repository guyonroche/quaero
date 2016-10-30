'use strict';

let singleton = null;

module.exports = {
  createDal: function createDal(config) {
    const type = config.type;
    const Dal = require(type);
    singleton = new Dal(config[type]);
    return singleton;
  },
  
  getDal: function() {
    return singleton;
  }
};