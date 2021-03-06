'use strict';

const { QuaeroError } = require('./exceptions');

module.exports = res => error => {
  if (error instanceof QuaeroError) {
    console.error('Quaero Error:', error.code, error.stack);
    res.status(error.status).json({error: error.message});
  } else {
    console.error('Unknown Error:', error.stack);
    res.status(500).json({error: 'Something went wrong'});
  }
};
