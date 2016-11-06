import React, { Component } from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';

import { login } from '../../api';
import { closeModal, addModalData, loggedIn } from '../../actions';

const Login = ({onLogin, onCancel, errorMessage}) => {
  let username, password;
  let handleKeyPress = e => {
    if (e.charCode == 13) {
      onLogin(username.value, password.value);
    }
  }
  return (
    <Modal isOpen={true} contentLabel="Login">
      <p>Username:
        <input
          type="text"
          ref={node => username = node}
          placeholder="Username"
          autoFocus
          onKeyPress={handleKeyPress}/>
      </p>
      <p>Password:
        <input
          type="password"
          ref={node => password = node}
          placeholder="Password"
          onKeyPress={handleKeyPress}/>
      </p>
      {
        errorMessage ? <h2>{errorMessage}</h2> : null
      }
      <p>
        <button onClick={() => onLogin(username.value, password.value)} >Login</button>
        <button onClick={() => onCancel()}>Cancel</button>
      </p>
    </Modal>
  );
};

let mapStateToProps = state => ({
  errorMessage: state.modal.data.error
});

let mapDispatchToProps = dispatch => ({
  onLogin(username, password) {
    // cheap validation
    if (!username) {
      return dispatch(addModalData({error: 'Username is empty'}));
    }
    if (!password) {
      return dispatch(addModalData({error: 'Password is empty'}));
    }
    // all good so go for it
    login(username, password)
      .then(result => dispatch(loggedIn(username)))
      .then(() => dispatch(closeModal()))
      .catch(error => dispatch(addModalData({error: error.message})))
  },
  onCancel() {
    dispatch(closeModal());
  }
});

 let LoginModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default LoginModal;
