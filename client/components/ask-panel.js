import React, { Component } from 'react';

import { login, logout } from '../actions';

class AskPanel extends Component {
  constructor() {
    super();
  }

  render() {
    let { store } = this.context;

    const state = store.getState();
    const user = state.user;

    return (
      <div className="search-panel">
        {
          user.username ?
            'Ask a new question here' :
            'You need to be logged in to ask the questions'
        }
      </div>
    );
  }
}
AskPanel.contextTypes = {
  store: React.PropTypes.object
};

export default AskPanel;