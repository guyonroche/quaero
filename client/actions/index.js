import * as api from '../api';

export const loggedIn = (username, sid) => ({
  type: 'LOGGED_IN',
  user: { username, sid }
});
export const logout = () => ({
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

export const openSignupModal = () => ({
  type: 'OPEN_SIGNUP_MODAL'
});
