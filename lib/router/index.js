'use strict';
let express = require('express');

let middleware = require('./middleware');
let auth = require('../controllers/auth');

let router = express.Router();

router.post('/user', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  auth.register(username, password)
    .then(user => {
      res.json({sid: user.sid});
    })
    .catch(error => {
      res.statusCode(400).json({error: 'Could not register user'});
    })
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  auth.login(username, password)
    .then(user => {
      res.json({sid: user.sid});
    })
    .catch(error => {
      res.statusCode(400).json({error: 'Could not log in'});
    })
});

module.exports = router;