'use strict';

var Promish = require('promish');
var { LoginFailure, NotLoggedInFailure } = require('../utils/exceptions');
var encryption = require('./encryption');
var DAL = require('../dal');

// one hour from now
let getExpiry = () => new Date(Date.now() + 3600000);
let checkExpiry = dt => dt.getTime >= Date.now();

let question = module.exports = {
  post: function (user, {title, text, tags}) {
    // post a new question
    let dal = DAL.getDal();

    // TODO: ensure tags are unique and < 1k (or some configurable amount/number)

    return encryption.generateRandomString(16)
      .then(quid => dal.createQuestion(quid, new Date(), user.userId, title, text, tags));
  },

  load: function(quid) {
    // read a single question and get its attachments

    // TODO: attach comments, answers and answers' comments
    return dal.getQuestion(quid);
  },

  search: function(text, tags) {
    // find questions by text and tags. Only the question part though, not attachments
    // TODO: pagination
    let dal = DAL.getDal();
    return dal.findQuestions(text, tags)
  }
};
