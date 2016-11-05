import React, { Component } from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';

import { register } from '../../api';
import { closeModal, setModalData, addModalData, loggedIn } from '../../actions';

let SignupModal = (function() {
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
    },
    onCancel() {
      dispatch(closeModal());
    }
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Signup);
})();

export default SignupModal;
