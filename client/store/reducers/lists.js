import { combineReducers } from 'redux';

const questionList = (listType) => (state = [], action) => {
  if (listType === action.listType) {
    switch (action.type) {
      case 'UPDATE_QUESTION_LIST':
        return action.questions;
    }
  }
  return state;
};

const lists = combineReducers({
  top: questionList('top'),
  recent: questionList('recent'),
  search: questionList('search'),
});

export default lists;