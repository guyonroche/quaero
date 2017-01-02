import React, { Component } from 'react';
import dateformat from 'dateformat';

import Container from './utils/container';
import { closeQuestion, watchQuestion, answerQuestion } from '../actions';

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

  renderDate(dt) {
    return dateformat(dt, 'dS mmm, yyyy');
  }

  renderQuestion(question, isLoggedIn) {
    return (
      <div className="question">
        <div className="question-header">
          <div className="question-title">{question.title}</div>
          <div className="question-close" onClick={this.onClose}>X</div>
        </div>
        <div className="question-post">{question.text}</div>
        <div className="question-footer">
          <div className="question-tags">
            {
              question.tags.map(tag => (
                <div className="question-tag">{tag}</div>
              ))
            }
          </div>
          <div className="question-details">
            <div>Asked {this.renderDate(question.created)}</div>
            <div>By {question.username}</div>
          </div>
        </div>

        {
          isLoggedIn ? (
              <div className="question-watch">
                Watch:
                <input type="checkbox" onChange={this.onWatch} defaultChecked={question.watching}/>
              </div>
            ) : null
        }
      </div>
    );
  }

  renderAnswer(answer, isLoggedIn) {
    return (
      <div className="answer">
        <div className="answer-post">{answer.text}</div>
        <div className="answer-footer">
          <div className="answer-details">
            <div>Answered {this.renderDate(answer.created)}</div>
            <div>By {answer.username}</div>
          </div>
        </div>
      </div>
    );
  }

  renderAnswerBox() {
    const { question } = this.props;
    let textArea;
    const post = () => {
      const answer = textArea.value;
      if (answer) {
        this.dispatch(answerQuestion(question.quid, answer));
      }
    };

    return (
      <div>
        <fieldset>
          <legend>Your Answer</legend>
          <div className="form-full-row">
            <textarea ref={node => textArea = node} className="form-element form-text" />
          </div>
          <div className="form-full-row">
            <button className="form-right" onClick={post}>Post Your Answer</button>
          </div>
        </fieldset>
      </div>
    );
  }

  renderAnswerCount(answers) {
    switch(answers.length) {
      case 1:
        return '1 Answer';
      default:
        return `${answers.length} Answers`
    }
  }

  render() {
    const { question } = this.props;
    const { user } = this.state;
    const isLoggedIn = !!(user && user.username);

    return (
      <div>
        {
          this.renderQuestion(question, isLoggedIn)
        }

        <div className="answers-count">
          {this.renderAnswerCount(question.answers)}
        </div>
        {
          question.answers.map(answer => this.renderAnswer(answer, isLoggedIn))
        }

        { isLoggedIn ? this.renderAnswerBox() : null }
      </div>
    );
  }
}

export default QuestionPanel;