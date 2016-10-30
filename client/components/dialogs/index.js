import React, { Component } from 'react';

import SignupModal from './sign-up';

class Dialogs extends Component {
  constructor() {
    super();
  }

  render() {
    let { store } = this.context;

    const state = store.getState();
    const modal = state.modal;

    switch(modal && modal.name) {
      case 'sign-up':
        return <SignupModal />
      default:
        return null;
    }
  }
}
Dialogs.contextTypes = {
  store: React.PropTypes.object
};

export default Dialogs;