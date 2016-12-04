'use strict';

const Promish = require('promish');
const _ = require('lodash');

const { TooMuchTagsError, UnsuportedListError } = require('../utils/exceptions');
const encryption = require('./encryption');
const DAL = require('../dal');

// one hour from now
const getExpiry = () => new Date(Date.now() + 3600000);
const checkExpiry = dt => dt.getTime >= Date.now();

// return object with subset of fields
const prune = (obj, fields) => fields.reduce((o, name) => {
  o[name] = obj[name];
  return o;
}, {});

const log = title => value => {
  console.log(title, value);
  return value;
};

const question = module.exports = {
  create: function create(user, {title, text, tags}) {
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

  fetch: function load(quid) {
    // read a single question and get its attachments
    let dal = DAL.getDal();

    // TODO: attach comments, answers and answers' comments
    return dal.getQuestionByQuid(quid);
  },

  search: function search(text, tags) {
    // find questions by text and tags. Only the question part though, not attachments
    // TODO: pagination
    let dal = DAL.getDal();
    return dal.findQuestions(text, tags)
  },

  getList: function getList(type) {
    // return list of questions by type
    let dal = DAL.getDal();
    const fields = ['quid', 'created', 'title', 'tags', 'text'];
    switch (type) {
      case 'top':
        // TODO: when questions have ratings
      case 'recent':
        // TODO: pagination
        return dal.listRecentQuestions()
          .then(log('listRecentQuestions'))
          .then(questions => questions.map(question => prune(question, fields)))
          .then(log('pruned'))

      default:
        throw new UnsuportedListError(type);
    }
  }
};
