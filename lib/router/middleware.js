'use strict';

const handleError = require('../utils/error-handler');
const auth = require('../controllers/auth');

class Middleware {
  static logger(req, res, next) {
    const timestamp = new Date().toISOString().split('T')[1].substring(0, -1);
    console.log(`${timestamp} ${req.method} ${req.url}`);
    next();
  }

  static checkSession(req, res, next) {
    const sid = req.headers.sid;
    auth.checkSession(sid)
      .then(user => {
        req.user = user;
        req.sid = sid;
        next();
      })
      .catch(handleError(res));
  }

  static optionalSession(req, res, next) {
    const sid = req.headers.sid;
    if (sid) {
      auth.checkSession(sid)
        .then(user => {
          req.user = user;
          req.sid = sid;
          next();
        })
        .catch(next);
    } else {
      next();
    }

  }
}

module.exports = Middleware;