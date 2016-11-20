
const questions = (state = [], action) => {
  switch (action.type) {
    case 'SHOW_QUESTION':
      return [
        action.question,
        ...state.filter(question => question.quid != action.quid)
      ];

    case 'HIDE_QUESTION':
      return state.filter(question => question.quid != action.quid);

    default:
      return state;
  }
};

export default questions;