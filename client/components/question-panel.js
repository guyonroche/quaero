import React, { Component } from 'react';

import { login, logout } from '../actions';

class QuestionPanel extends Component {
  constructor() {
    super();
  }

  render() {
    const { question } = this.props;

    return (
      <div>
        <h1 className="question-header">{question.title}</h1>
        <div className="question-post">{question.text}</div>
        <div className="question-tags">
          {
            question.tags.map(tag => (
              <div className="question-tag">{tag}</div>
            ))
          }
        </div>
      </div>
    );
  }
}
QuestionPanel.contextTypes = {
  store: React.PropTypes.object
};

export default QuestionPanel;