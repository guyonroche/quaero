import { combineReducers } from 'redux';

import user from './user';
import modal from './modal';
import questions from './questions';
import lists from './lists';
import showQuestion from './show-question';

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
  lists,

  // a hint to the tab panel as to which tab to show initially
  showQuestion,
});

export default app;