
export const loggedIn = (username) => ({
  type: 'LOGGED_IN',
  user: { username }
});
export const loggedOut = () => ({
  type: 'LOGGED_OUT'
});
export const closeModal = () => ({
  type: 'CLOSE_MODAL'
});
export const setModalData = (data) => ({
  type: 'SET_MODAL_DATA',
  data
});
export const addModalData = (data) => ({
  type: 'ADD_MODAL_DATA',
  data
});

export const openModal = name => ({
  type: 'OPEN_MODAL',
  name
});

export const showQuestion = question => ({
  type: 'SHOW_QUESTION',
  question
});

export const hideQuestion = quid => ({
  type: 'HIDE_QUESTION',
  quid
});

export const updateQuestionList = (listType, questions) => ({
  type: 'UPDATE_QUESTION_LIST',
  listType,
  questions
});