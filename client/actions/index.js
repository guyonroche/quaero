import * as api from '../api'

const loggedIn = (username) => ({
  type: 'LOGGED_IN',
  user: { username }
});
const loggedOut = () => ({
  type: 'LOGGED_OUT'
});

const setModalData = (data) => ({
  type: 'SET_MODAL_DATA',
  data
});
const addModalData = (data) => ({
  type: 'ADD_MODAL_DATA',
  data
});

const showQuestion = question => ({
  type: 'SHOW_QUESTION',
  question
});
const hideQuestion = quid => ({
  type: 'HIDE_QUESTION',
  quid
});

const updateQuestionList = (listType, questions) => ({
  type: 'UPDATE_QUESTION_LIST',
  listType,
  questions
});

const watchingQuestion = (quid, active) => ({
  type: 'WATCHING_QUESTION',
  quid,
  active
});

export const logIn = (username, password, next) => (dispatch, getState) => {
  // TODO: better state management here - 'session' section? errors?
  // TODO: move sid to redux - control it here
  // validation
  if (!username) {
    return dispatch(addModalData({error: 'Username is empty'}));
  }
  if (!password) {
    return dispatch(addModalData({error: 'Password is empty'}));
  }

  // clear any previous errors
  dispatch(addModalData({error: null}));

  api.login(username, password)
    .then(result => dispatch(loggedIn(username)))
    .then(() => dispatch(next))
    .catch(error => dispatch(addModalData({error: error.message})));
};

export const register = (username, password, confirm, next) => (dispatch, getState) => {
  // validation
  if (!username) {
    return dispatch(addModalData({error: 'You must choose a username'}));
  }
  if (!password || password.length < 8) {
    return dispatch(addModalData({error: 'Password must be at least 8 chars'}));
  }
  if (password !== confirm) {
    return dispatch(addModalData({error: `Password and confirm don't match`}));
  }

  // clear any previous errors
  dispatch(addModalData({error: null}));
};

export const logOut = () => (dispatch, getState) => {
  api.logout()
    .then(() => dispatch(loggedOut()))
};

export const closeModal = () => ({
  type: 'CLOSE_MODAL'
});

export const openModal = name => ({
  type: 'OPEN_MODAL',
  name
});

export const askQuestion = (title, tags, text) => (dispatch, getState) => {
  api.ask(title, tags, text)
    .then(({quid}) => {
      dispatch(openQuestion({quid, title, tags, text}));
    });
};

export const openQuestion = (quid) => (dispatch, getState) => {
  api.getQuestion(quid)
    .then(question => dispatch(showQuestion(question)))
    .then(() => {
      // if logged in, mark question as viewing
      const user = getState().user;
      if (user && user.username) {
        api.addViewing(quid);
      }
    });
};

export const closeQuestion = (quid) => (dispatch, getState) => {
  dispatch(hideQuestion(quid));
  const user = getState().user;
  if (user && user.username) {
    api.removeViewing(quid);
  }
};

export const getQuestionList = (type ) => (dispatch, getState) => {
  api.getList(type)
    .then(questions => {
      dispatch(updateQuestionList(type, questions));
    });
};

export const watchQuestion = (quid, active) => (dispatch, getState) => {
  (active ? api.addWatching(quid) : api.removeWatching(quid))
    .then(() => dispatch(watchingQuestion(quid, active)));
};
