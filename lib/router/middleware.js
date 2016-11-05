'use strict';

let { handleError } = require('../utils/error-handler');
let auth = require('../controllers/auth');

var middleware = module.exports = {
  logger: function(req, res, next) {
    const timestamp = new Date().toISOString().split('T')[1].substring(0,-1);
    console.log(`${timestamp} IN ${req.url}`);
    next();
  },
  checkSession: function(req, res, next) {
    let sid = req.headers.sid;
    auth.checkSession(sid)
      .then(user => {
        req.user = user;
        req.sid = sid;
        next();
      })
      .catch(handleError(res));
  }
};