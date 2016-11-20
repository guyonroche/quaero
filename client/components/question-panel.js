import React, { Component } from 'react';

import { login, logout } from '../actions';

class QuestionPanel extends Component {
  constructor() {
    super();
  }

  render() {

    return (
      <div className="question-list">
        Question details go here
      </div>
    );
  }
}
QuestionPanel.contextTypes = {
  store: React.PropTypes.object
};

export default QuestionPanel;