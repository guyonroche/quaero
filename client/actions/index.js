import * as api from '../api';

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
