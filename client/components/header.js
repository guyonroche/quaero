import React, { Component } from 'react';
import Container from './utils/container';

import { openModal, logOut } from '../actions';

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
  constructor(props) {
    super(props);
  }
  
  render() {
    const { user } = this.state;

    if (user && user.username) {
      return (
        <LoggedInHeader
          user={user}
          onLogout={() => this.dispatch(logOut())}
        />
      );
    } else {
      return (
        <AnonHeader
          onSignup={() => this.dispatch(openModal('sign-up'))}
          onLogin={() => this.dispatch(openModal('login'))}
        />
      );
    }
  }
}


export default Header;