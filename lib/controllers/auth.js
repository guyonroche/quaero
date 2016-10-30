'use strict';

var encryption = require('./encryption');
var DAL = require('../dal');

let auth = module.exports = {
  register: function(username, password) {
    return DAL.getDal().createUser(username, password)
      .then(() => auth.login(username, password));
  },
  
  login: function(username, password) {
    let dal = DAL.getDal();
    return dal.getUserByUsername(username)
      .then(user => {
        return encryption.checkPassword(password, user.password)
          .then(() => dal.clearSessions(user.userId))
          .then(() => encryption.generateRandomString(32))
          .then(sid => user.sid = sid)
          .then(() => dal.createSession(sid, user.userId))
          .then(() => user);
      });
  },
  checkSession: function(sid) {
    let dal = DAL.getDal();
    return dal.getSessionEx(sid)
      .then(session => session.user);
  }
};