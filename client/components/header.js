import React, { Component } from 'react';
import Container from './utils/container';

import { openModal, loggedOut } from '../actions';
import { logout } from '../api';

const AnonHeader = ({onSignup, onLogin}) => (
  <div className="header-bar">
    <div className="app-header-title">Quaero</div>
    <nav className="app-header-nav">
      <ul>
        <li onClick={onSignup}>Sign Up</li>
        <li onClick={onLogin}>Log In</li>
        <li>Help</li>
        <li><input type="text" placeholder="Search"/></li>
      </ul>
    </nav>
  </div>
);

const LoggedInHeader = ({user, onLogout}) => (
  <div className="header-bar">
    <div className="app-header-title">Quaero</div>
    <nav className="app-header-nav">
      <ul>
        <li>{user.username}</li>
        <li onClick={onLogout}>Log Out</li>
        <li>Help</li>
        <li><input type="text" placeholder="Search"/></li>
      </ul>
    </nav>
  </div>
);

class Header extends Container {
  constructor() {
    super();
  }
  
  render() {
    const { store } = this.context;
    const { user } = this.state;

    if (user && user.username) {
      const onLogout = () => {
        logout()
          .then(() => store.dispatch(loggedOut()))
      };

      return (
        <LoggedInHeader
          user={user}
          onLogout={onLogout}
        />
      );
    } else {
      return (
        <AnonHeader
          onSignup={() => store.dispatch(openModal('sign-up'))}
          onLogin={() => store.dispatch(openModal('login'))}
        />
      );
    }
  }
}
Header.contextTypes = {
  store: React.PropTypes.object
};

export default Header;