export const login = (username, password) => ({
  type: 'LOGGED_IN',
  user: {
    username
  }
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
export const register = (username, password) => ({
  type: 'LOGGED_IN',
  user: {
    username,
    password
  }
});