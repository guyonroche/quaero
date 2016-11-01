import React, { Component } from 'react';
import Modal from 'react-modal';

import { register } from '../../api';
import { closeModal, setModalData, addModalData, loggedIn } from '../../actions';

class SignupModal extends Component {
  constructor() {
    super();
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

      // cheap validation
      if (!username) {
        return store.dispatch(setModalData({...data, error: 'You must choose a username'}));
      }
      if (!password || password.length < 8) {
        return store.dispatch(setModalData({...data, error: 'Password must be at least 8 chars'}));
      }
      if (password !== confirm) {
        return store.dispatch(setModalData({...data, error: `Password and confirm don't match`}));
      }
      
      // all good so go for it
      register(username, password)
        .then(result => store.dispatch(loggedIn(username, result.sid)))
        .then(() => store.dispatch(closeModal()))
        .catch(error => store.dispatch(addModalData({error: error.message})))
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