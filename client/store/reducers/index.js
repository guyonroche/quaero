import { combineReducers } from 'redux';

import user from './user';
import modal from './modal';
import questions from './questions';
import lists from './lists';

const app = combineReducers({

  // user contains all about the logged in user
  user,

  // modal is used to display a (any) modal
  modal,

  // questions is the list of viewed questions.
  // Each one has its own tab
  questions,

  // lists are the questions fetched by queries
  // E.g. top, recent, search, etc
  lists
});

export default app;