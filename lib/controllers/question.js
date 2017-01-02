'use strict';

const Promish = require('promish');
const _ = require('lodash');

const { TooMuchTagsError, UnsupportedListError } = require('../utils/exceptions');
const encryption = require('./encryption');
const DAL = require('../dal');

// one hour from now
// const getExpiry = () => new Date(Date.now() + 3600000);
// const checkExpiry = dt => dt.getTime >= Date.now();

// return object with subset of fields
const prune = (obj, fields) => fields.reduce((o, name) => {
  o[name] = obj[name];
  return o;
}, {});

const log = title => value => {
  console.log(title, value);
  return value;
};

class Question {
  static create(user, {title, text, tags}) {
    // post a new question
    const dal = DAL.getDal();

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
  }

  static fetch(user, quid) {
    // read a single question and get its attachments
    const dal = DAL.getDal();

    // TODO: attach comments, answers and answers' comments
    let promises = [
      dal.getQuestionByQuid(quid),
      dal.getAnswersForQuid(quid)
    ];

    if (user) {
      promises.push(dal.getWatch(user.userId, quid))
    }

    return Promish.all(promises)
      .then(log('question and answers'))
      .then(([question, answers, watch]) => ({
        quid: question.quid,
        created: question.created,
        title: question.title,
        text: question.text,
        tags: question.tags,
        username: question.username,
        answers: answers.map(answer => ({
          created: answer.created,
          username: answer.username,
          text: answer.text
        })),
        watching: watch ? (watch.watching !== 0) : undefined
      }));
  }

  static search(text, tags) {
    // find questions by text and tags. Only the question part though, not attachments
    // TODO: pagination
    const dal = DAL.getDal();
    return dal.findQuestions(text, tags)
  }

  static getList(type) {
    // return list of questions by type
    const dal = DAL.getDal();
    const fields = ['quid', 'created', 'title', 'tags', 'text'];
    switch (type) {
      case 'top':
      // TODO: when questions have ratings
      case 'recent':
        // TODO: pagination
        return dal.listRecentQuestions()
          .then(questions => questions.map(question => prune(question, fields)));

      default:
        throw new UnsupportedListError(type);
    }
  }

  static answer(user, {quid, text}) {
    const dal = DAL.getDal();
    return dal.addAnswer(user.userId, quid, text);
  }
}

module.exports = Question;