import React, { Component } from 'react';

import Container from './utils/container';
import { hideQuestion } from '../actions';
import { addWatching, removeWatching, addViewing, removeViewing } from '../api';

class QuestionPanel extends Container {
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
    this.onWatch = this.onWatch.bind(this);
  }

  onClose() {
    const { question } = this.props;
    const { user } = this.state;

    this.dispatch(hideQuestion(question.quid));
    if(user && user.username) {
      removeViewing(question.quid);
    }
  }

  onWatch(e) {
    const { question } = this.props;
    const watching = !!e.target.checked;
    if (watching) {
      addWatching(question.quid);
    } else {
      removeWatching(question.quid);
    }
  }

  componentWillMount() {
    super.componentWillMount();

    const { question } = this.props;
    const {user} = this.state;
    if (user && user.username) {
      addViewing(question.quid);
    }
  }

  render() {
    const { question } = this.props;
    const { user } = this.state;

    return (
      <div>
        <div className="question-header">
          <div className="question-title">{question.title}</div>
          {
            user && user.username ? (
              <div className="question-watch">
                Watch:
                <input type="checkbox" onChange={this.onWatch}/>
              </div>
            ) : null
          }
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
      </div>
    );
  }
}

export default QuestionPanel;