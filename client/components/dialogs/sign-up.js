import React, { Component } from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';

import { register, closeModal } from '../../actions';

const Signup = ({onSignup, onCancel, errorMessage}) => {
  let username, password, confirm;

  return (
    <Modal isOpen={true} contentLabel="Sign Up">
      <h1>Please enter a username and password</h1>
      <p>Username:
        <input
          type="text"
          ref={node => username = node}
          placeholder="Username" />
      </p>
      <p>Password:
        <input
          type="password"
          ref={node => password = node}
          placeholder="Password" />
      </p>
      <p>Confirm:
        <input
          type="password"
          ref={node => confirm = node}
          placeholder="Password" />
      </p>
      {
        errorMessage ? <h2>{errorMessage}</h2> : null
      }
      <p>
        <button onClick={() => onSignup(username.value, password.value, confirm.value)}>Sign Up</button>
        <button onClick={() => onCancel()}>Cancel</button>
      </p>
    </Modal>
  );
};

let mapStateToProps = state => ({
  errorMessage: state.modal.data.error
});

let mapDispatchToProps = dispatch => ({
  onSignup(username, password, confirm) {
    dispatch(register(username, password, confirm, closeModal()));
  },
  onCancel() {
    dispatch(closeModal());
  }
});

let SignupModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);

export default SignupModal;
