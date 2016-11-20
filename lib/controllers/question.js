'use strict';

var Promish = require('promish');
let _ = require('lodash');

var { LoginFailure, NotLoggedInFailure, TooMuchTagsError } = require('../utils/exceptions');
var encryption = require('./encryption');
var DAL = require('../dal');

// one hour from now
let getExpiry = () => new Date(Date.now() + 3600000);
let checkExpiry = dt => dt.getTime >= Date.now();

let question = module.exports = {
  create: function (user, {title, text, tags}) {
    // post a new question
    let dal = DAL.getDal();

    // ensure tags are unique and < 1k
    tags = _.uniq(tags);
    const totalTagLen = tags.reduce((c, t) => c + t.length, 0);
    if (totalTagLen > 1024) {
      return Promish.reject(new TooMuchTagsError());
    }

    return encryption.generateRandomString(16)
      .then(quid => {
        return dal.createQuestion(quid, new Date(), user.userId, title, text, tags)
          .then(() => quid);
      });
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
