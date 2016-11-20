import { combineReducers } from 'redux';

import user from './user';
import modal from './modal';
import questions from './questions';

const app = combineReducers({
  user,
  modal,
  questions
});

export default app;