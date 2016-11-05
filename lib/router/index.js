'use strict';
let express = require('express');

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
    .catch(error => {
      console.log('Error during register:', error.stack)
      res.status(400).json({error: 'Could not register user'});
    })
});

router.post('/user/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  auth.login(username, password)
    .then(user => {
      res.json({sid: user.sid});
    })
    .catch(error => {
      res.status(400).json({error: 'Could not log in'});
    });
});

router.post('/user/logout', checkSession, (req, res) => {
  auth.logout(req.user.sid)
    .then(user => {
      res.json({});
    })
    .catch(error => {
      if (error.message === 'Not logged in') {
        res.json({});
      } else {
        res.status(400).json({error: 'Could not log out'});
      }
    });
});



module.exports = router;