'use strict';

class QuaeroError extends Error {
  constructor(code, status, message) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

class LoginFailure extends QuaeroError {
  constructor() {
    super('LOGIN_FAIL', 401, 'Username or password did not match our records');
  }
}

class NotLoggedInFailure extends QuaeroError {
  constructor() {
    super('NOT_LOGGED_IN', 401, 'Not logged in');
  }
}

class TooMuchTagsError extends QuaeroError {
  constructor() {
    super('TOO_MUCH_TAGS', 400, 'Too many tags');
  }
}

module.exports = {
  QuaeroError,
  LoginFailure,
  NotLoggedInFailure,
  TooMuchTagsError,
};