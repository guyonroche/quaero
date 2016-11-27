import React, { Component } from 'react';

import { hideQuestion } from '../actions';

class QuestionPanel extends Component {
  constructor() {
    super();

    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    const {store} = this.context;
    const { question } = this.props;
    store.dispatch(hideQuestion(question.quid));
  }

  render() {
    const { question } = this.props;

    return (
      <div>
        <div className="question-header">
          <div className="question-title">{question.title}</div>
          <div className="question-close">X</div>
        </div>
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