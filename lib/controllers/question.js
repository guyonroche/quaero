'use strict';

var { LoginFailure, NotLoggedInFailure } = require('../utils/exceptions');
var encryption = require('./encryption');
var DAL = require('../dal');

// one hour from now
let getExpiry = () => new Date(Date.now() + 3600000);
let checkExpiry = dt => dt.getTime >= Date.now();

let question = module.exports = {
  ask: function (user, post) {
    let dal = DAL.getDal();

    return dal.insertQuestion(user.userId, post.title, post.tags, post.text);
  }
};
