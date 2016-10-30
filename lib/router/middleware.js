'use strict';

let auth = require('../controllers/auth');

var middleware = module.exports = {
  checkSession: function(req, res, next) {
    let sid = req.headers.sid;
    auth.checkSession(sid)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(error => {
        res.status(401).json({error: 'Not logged in'});
      })
  }
};