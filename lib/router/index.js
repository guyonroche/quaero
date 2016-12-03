'use strict';
let express = require('express');

let { handleError } = require('../utils/error-handler');
let {logger, checkSession} = require('./middleware');
let auth = require('../controllers/auth');
let question = require('../controllers/question');

let router = express.Router();

// log all incoming urls
router.use(logger);

// TODO: make login requirement for each endpoint configurable

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

  question.create(req.user, {title, tags, text})
    .then(quid => res.json({quid}))
    .catch(handleError(res));
});

router.get('/search?', (req, res) => {
  let text = req.query.text || '';
  let tags = req.query.tag || [];
  console.log('SEARCH', text, tags);
  if (typeof tags === 'string') {
    tags = [tags];
  }
  if (typeof text !== 'string') {
    res.status(400).json({error: 'I did not understand this query'});
  } else {
    question.search(text, tags)
      .then(results => res.json(results))
      .catch(handleError(res));
  }
});

router.get('/list/:type', (req, res) => {
  console.log(`list/${req.params.type}`);
  question.getList(req.params.type)
    .then(questions => {
      res.json({questions});
    })
    .catch(handleError(res));
});

module.exports = router;