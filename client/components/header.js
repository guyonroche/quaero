import React, { Component } from 'react';

import { login, logout, openSignupModal } from '../actions';

class Header extends Component {
  constructor() {
    super();
  }
  
  renderAnon() {
    let { store } = this.context;
    const onLogin = () => {
      store.dispatch(login());
    };
    const onSignup = () => {
      store.dispatch(openSignupModal());
    };

    return (
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
  }

  renderLoggedIn(user) {
    let { store } = this.context;
    const onLogout = () => {
      store.dispatch(logout());
    };

    return (
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
  }

  render() {
    let { store } = this.context;

    const state = store.getState();
    const user = state.user;

    if (user.username) {
      return this.renderLoggedIn(user);
    } else {
      return this.renderAnon();
    }
  }
}
Header.contextTypes = {
  store: React.PropTypes.object
};

export default Header;