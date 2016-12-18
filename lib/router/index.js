'use strict';
const express = require('express');

const handleError = require('../utils/error-handler');
const {logger, checkSession, optionalSession} = require('./middleware');

const auth = require('../controllers/auth');
const question = require('../controllers/question');
const watch = require('../controllers/watch');

const router = express.Router();

// log all incoming urls
router.use(logger);

// TODO: make login requirement for each endpoint configurable

// ========================================================
// Authentication

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

// ========================================================
// Questions

router.post('/ask', checkSession, (req, res) => {
  const { title, tags, text } = req.body;
  console.log('ASK', title, tags, text);

  question.create(req.user, {title, tags, text})
    .then(res.json)
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
      .then(res.json)
      .catch(handleError(res));
  }
});

router.get('/list/:type', (req, res) => {
  question.getList(req.params.type)
    .then(data => res.json(data))
    .catch(handleError(res));
});

router.get('/question/:quid', optionalSession, (req, res) => {
  // TODO: add watching/answers/comments/etc.
  question.fetch(req.user, req.params.quid)
    .then(data => res.json(data))
    .catch(handleError(res));
});

router.get('/watch/watching', checkSession, (req, res) => {
  watch.getWatching(req.user)
    .then(data => res.json(data))
    .catch(handleError(res));
});
router.put('/watch/watching/:quid', checkSession, (req, res) => {
  const {quid} = req.params;
  watch.updateWatching(req.user, quid, true)
    .then(() => res.send('OK'))
    .catch(handleError(res));
});
router.delete('/watch/watching/:quid', checkSession, (req, res) => {
  const {quid} = req.params;
  watch.updateWatching(req.user, quid, false)
    .then(() => res.send('OK'))
    .catch(handleError(res));
});

router.get('/watch/viewing', checkSession, (req, res) => {
  watch.getViewing(req.user)
    .then(data => res.json(data))
    .catch(handleError(res));
});
router.put('/watch/viewing/:quid', checkSession, (req, res) => {
  const {quid} = req.params;
  watch.updateViewing(req.user, quid, true)
    .then(() => res.send('OK'))
    .catch(handleError(res));
});
router.delete('/watch/viewing/:quid', checkSession, (req, res) => {
  const {quid} = req.params;
  watch.updateViewing(req.user, quid, false)
    .then(() => res.send('OK'))
    .catch(handleError(res));
});

router.get('/watch/history', checkSession, (req, res) => {
  watch.getHistory(req.user)
    .then(data => res.json(data))
    .catch(handleError(res));
});
router.delete('/watch/history', checkSession, (req, res) => {
  watch.clear(req.user)
    .then(() => res.send('OK'))
    .catch(handleError(res));
});

module.exports = router;