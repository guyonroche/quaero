'use strict';

var encryption = require('./encryption');
var DAL = require('../dal');

// one hour from now
let getExpiry = () => new Date(Date.now() + 3600000);
let checkExpiry = dt => dt.getTime >= Date.now();

let auth = module.exports = {
  register: function(username, password) {
    return encryption.hashPassword(password)
      .then(hash => DAL.getDal().createUser(username, hash))
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
          .then(() => dal.createSession(user.sid, user.userId, getExpiry()))
          .then(() => user);
      });
  },
  checkSession: function(sid) {
    let dal = DAL.getDal();
    return dal.getSessionEx(sid)
      .then(session => {
        if (checkExpiry(session.expiry)) {
          return dal.updateSessionExpiry(sid, getExpiry())
            .then(() => session.user);
        } else {
          throw new Error('Not logged in');
        }
      });
  }
};