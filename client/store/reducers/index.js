import { combineReducers } from 'redux';

import user from './user';
import modal from './modal';
import questions from './questions';

const app = combineReducers({
  user,
  modal,
  questions
});

// TODO: need list of top and recent questions - with simple fetch and replace

export default app;