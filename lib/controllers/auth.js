'use strict';

const { LoginFailure, NotLoggedInFailure } = require('../utils/exceptions');
const encryption = require('./encryption');
const DAL = require('../dal');

// one hour from now
const getExpiry = () => new Date(Date.now() + 3600000);
const checkExpiry = dt => dt.getTime() >= Date.now();

class Auth {
  static register(username, password) {
    return encryption.hashPassword(password)
      .then(hash => DAL.getDal().createUser(username, hash))
      .then(() => auth.login(username, password));
  }

  static login(username, password) {
    const dal = DAL.getDal();
    return dal.getUserByUsername(username)
      .then(user => {
        if (!user) {
          throw new LoginFailure();
        }
        return encryption.checkPassword(password, user.password)
          .then(result => {
            if (!result) {
              throw new LoginFailure();
            }
          })
          .then(() => dal.deleteExpiredSessions(user.userId, new Date()))
          .then(() => encryption.generateRandomString(32))
          .then(sid => user.sid = sid)
          .then(() => dal.createSession(user.sid, user.userId, getExpiry()))
          .then(() => user);
      });
  }

  static logout(sid) {
    return dal.deleteSession(sid);
  }

  static checkSession(sid) {
    const dal = DAL.getDal();
    return dal.getSessionEx(sid)
      .then(session => {
        if (session) {
          if (checkExpiry(session.expires)) {
            return dal.updateSessionExpiry(sid, getExpiry())
              .then(() => session.user);
          }
        }
        throw new NotLoggedInFailure();
      });
  }
}

module.exports = Auth;