'use strict';
let express = require('express');

let { handleError } = require('../utils/error-handler');
let {logger, checkSession} = require('./middleware');
let auth = require('../controllers/auth');

let router = express.Router();

// log all incoming urls
router.use(logger);

router.post('/user/register', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('register', username, password)
  
  auth.register(username, password)
    .then(user => {
      res.json({sid: user.sid});
    })
    .catch(handleError(res))
});

router.post('/user/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  auth.login(username, password)
    .then(user => {
      res.json({sid: user.sid});
    })
    .catch(handleError(res))
});

router.post('/user/logout', checkSession, (req, res) => {
  auth.logout(req.user.sid)
    .then(() => {
      res.json({});
    })
    .catch(handleError(res));
});



module.exports = router;