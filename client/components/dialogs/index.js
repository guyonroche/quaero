import React, { Component } from 'react';

import SignupModal from './sign-up';
import LoginModal from './login';

class Dialogs extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState())
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }


  render() {
    const { modal } = this.state;

    switch(modal && modal.name) {
      case 'sign-up':
        return <SignupModal />
      case 'login':
        return <LoginModal />
      default:
        return null;
    }
  }
}
Dialogs.contextTypes = {
  store: React.PropTypes.object
};

export default Dialogs;