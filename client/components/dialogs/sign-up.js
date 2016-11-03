import React, { Component } from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';

import { register } from '../../api';
import { closeModal, setModalData, addModalData, loggedIn } from '../../actions';

const Signup = props => {
  let usernameInput, passwordInput, confirmInput;
  let onSignup = () => {
    props.onSignup(usernameInput.value, passwordInput.value, confirmInput.value);
  };
  const errorMessage = props.error;
  return (
    <Modal isOpen={true} contentLabel="Sign Up">
      <h1>Please enter a username and password</h1>
      <p>Username:
        <input
          type="text"
          ref={node => usernameInput = node}
          placeholder="Username" />
      </p>
      <p>Password:
        <input
          type="password"
          ref={node => passwordInput = node}
          placeholder="Password" />
      </p>
      <p>Confirm:
        <input
          type="password"
          ref={node => confirmInput = node}
          placeholder="Password" />
      </p>
      {
        errorMessage ? <h2>{errorMessage}</h2> : null
      }
      <p>
        <button onClick={onSignup}>Sign Up</button>
      </p>
    </Modal>
  );
};

let mapStateToProps = state => ({
  error: state.modal.data.error
});

let mapDispatchToProps = dispatch => ({
  onSignup(username, password, confirm) {
    // cheap validation
    if (!username) {
      return dispatch(addModalData({error: 'You must choose a username'}));
    }
    if (!password || password.length < 8) {
      return dispatch(addModalData({error: 'Password must be at least 8 chars'}));
    }
    if (password !== confirm) {
      return dispatch(addModalData({error: `Password and confirm don't match`}));
    }

    // all good so go for it
    register(username, password)
      .then(result => dispatch(loggedIn(username, result.sid)))
      .then(() => dispatch(closeModal()))
      .catch(error => dispatch(addModalData({error: error.message})))
  }
});

let SignupModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);

export default SignupModal;
