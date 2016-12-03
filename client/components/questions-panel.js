import React, { Component } from 'react';
import Container from './utils/container';
import { getList } from '../api';
import { updateQuestionList } from '../actions';

class QuestionsPanel extends Container {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    super.componentWillMount();

    const { type } = this.props;
    if (!this.state.lists[type].length) {
      getList(type)
        .then(({questions}) => {
          this.dispatch(updateQuestionList(type, questions));
        });
    }
  }

  render() {
    const { type } = this.props;
    const questions = this.state.lists[type];

    if (questions) {
      return (
        <div className="question-list">
          {
            questions.map(question => (
              <div className="question-item">
                <div>{question.title}</div>
                <div>{question.tags}</div>
              </div>
            ))
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