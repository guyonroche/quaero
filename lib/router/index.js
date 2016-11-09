'use strict';
let express = require('express');

let { handleError } = require('../utils/error-handler');
let {logger, checkSession} = require('./middleware');
let auth = require('../controllers/auth');
let question = require('../controllers/question');

let router = express.Router();

// log all incoming urls
router.use(logger);

router.post('/user/register', (req,res) => {
  const { username,  password } = req.body;
  auth.register(username, password)
    .then(user => {
      res.json({sid: user.sid});
    })
    .catch(handleError(res))
});

router.post('/user/login', (req, res) => {
  const { username,  password } = req.body;
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

router.post('/ask', checkSession, (req, res) => {
  const { title, tags, text } = req.body;
  console.log('ASK', title, tags, text);
  question.ask(req.user, {title, tags, text})
    .then(() => res.json({}))
    .catch(handleError(res));
});

module.exports = router;