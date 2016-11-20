import React, { Component } from 'react';

import { login, logout } from '../actions';

class QuestionsPanel extends Component {
  constructor() {
    super();
  }

  render() {
    let { type } = this.props;
    let { store } = this.context;

    const state = store.getState();
    const user = state.user;

    return (
      <div className="question-list">
        List of {type} questions go here
      </div>
    );
  }
}
QuestionsPanel.contextTypes = {
  store: React.PropTypes.object
};

export default QuestionsPanel;