import React, { Component } from 'react';
import Container from './utils/container';
import { openQuestion, getQuestionList } from '../actions';

class QuestionsPanel extends Container {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    super.componentWillMount();

    const { type } = this.props;
    if (!this.state.lists[type].length) {
      this.dispatch(getQuestionList(type));
    }
  }

  viewQuestion(quid) {
    this.dispatch(openQuestion(quid));
  }

  render() {
    const { type } = this.props;
    const questions = this.state.lists[type];

    if (questions) {
      return (
        <div className="question-list">
          {
            questions.map(question => {
              return (
                <div key={question.quid} className="question-list-item" onClick={() => this.viewQuestion(question.quid)}>
                  <div className="question-list-title">{question.title}</div>
                  <div className="question-tags">
                    {
                      question.tags.map(tag => (<div className="question-tag">{tag}</div>))
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      );
    } else {
      return <div className="question-list">
        Loading {type} questions...
      </div>
    }
  }
}

export default QuestionsPanel;