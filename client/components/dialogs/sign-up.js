import React, { Component } from 'react';
import Modal from 'react-modal';

import { register, closeModal, setModalData } from '../../actions';

class SignupModal extends Component {
  constructor() {
    super();
  }

  validate(store, username, password, confirm) {
    // cheap validation
    if (!username) {
      store.dispatch(setModalData({...data, error: 'You must choose a username'}));
      return false;
    }
    if (!password || password.length < 8) {
      store.dispatch(setModalData({...data, error: 'Password must be at least 8 chars'}));
      return false;
    }
    if (password !== confirm) {
      store.dispatch(setModalData({...data, error: `Password and confirm don't match`}));
      return false;
    }

    return true;
  }
  
  render() {
    let { store } = this.context;
    const state = store.getState();
    const data = state.modal.data || {};
    
    let usernameInput, passwordInput, confirmInput;
    let onSignup = () => {
      const username = usernameInput.value;
      const password = passwordInput.value;
      const confirm = confirmInput.value;

      if (this.validate(store, username, password, confirm)) {
        // all good so go for it
        store.dispatch(register(username, password));
        store.dispatch(closeModal());
      }
    };
    
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
          data.error ? <h2>{data.error}</h2> : null
        }
        <p>
          <button onClick={onSignup}>Sign Up</button>
        </p>
      </Modal>
    );
  }
}
SignupModal.contextTypes = {
  store: React.PropTypes.object
};

export default SignupModal;