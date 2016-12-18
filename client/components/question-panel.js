import React, { Component } from 'react';

import Container from './utils/container';
import { closeQuestion, watchQuestion } from '../actions';

class QuestionPanel extends Container {
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
    this.onWatch = this.onWatch.bind(this);
  }

  onClose() {
    const { question } = this.props;
    this.dispatch(closeQuestion(question.quid));
  }

  onWatch(e) {
    const { question } = this.props;
    const watching = !!e.target.checked;
    this.dispatch(watchQuestion(question.quid, watching));
  }

  render() {
    const { question } = this.props;
    const { user } = this.state;

    return (
      <div>
        <div className="question-header">
          <div className="question-title">{question.title}</div>
          <div className="question-close" onClick={this.onClose}>X</div>
        </div>
        <div className="question-post">{question.text}</div>
        <div className="question-tags">
          {
            question.tags.map(tag => (
              <div className="question-tag">{tag}</div>
            ))
          }
        </div>
        {
          user && user.username ? (
              <div className="question-watch">
                Watch:
                <input type="checkbox" onChange={this.onWatch} defaultChecked={question.watching}/>
              </div>
            ) : null
        }
      </div>
    );
  }
}

export default QuestionPanel;