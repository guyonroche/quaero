import React, { Component } from 'react';
import Container from './utils/container';
import { query } from '../api';
import { updateQuestionList } from '../actions';

class QuestionsPanel extends Container {
  constructor() {
    super();
  }

  componentWillMount() {
    const {store} = this.context;
    const { type } = this.props;
    if (!this.state[type]) {
      query(type)
        .then(questions => {
          store.dispatch(updateQuestionList(type, questions));
        });
    }
  }

  render() {
    const { type } = this.props;
    const questions = this.state[type];

    if (!questions) {
      return <div className="question-list">
        Loading {type} questions...
      </div>
    }

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