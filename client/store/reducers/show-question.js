
const showQuestion = (state = null, action) => {
  switch (action.type) {
    case 'SHOW_QUESTION':
      return action.question.quid;

    default:
      return null;
  }
};

export default showQuestion;