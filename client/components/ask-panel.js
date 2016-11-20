import React, { Component } from 'react';
import FormContainer from './utils/form-container';

import { ask } from '../api';
import { openModal, showQuestion } from '../actions';

const UserWall = ({onSignup, onLogin}) => (
  <div>
    <p>You need to be logged in to ask questions here</p>
    <p>
      Please
      <button onClick={onSignup}>Sign Up</button> or
      <button onClick={onLogin}>Log In</button> to continue...
    </p>
  </div>
);

const AskForm = ({onPost, onValidate, titleError, textError, postError}) => {
  let fields = {};

  let validate = name => () => {
    onValidate(name, fields[name].value.trim());
  };

  let post = () => {
    onPost(
      fields.title.value.trim(),
      fields.tags.value.split(',').map(tag=> tag.trim()),
      fields.text.value.trim(),
    );
  };

  return (
    <div>
      <fieldset>
        <legend>Ask a New Question</legend>
        <div className="form-row">
          <div className="form-label">
            <label className="form-element" for="ask-title">Title:</label>
          </div>
          <div className={`form-input ${titleError ? 'form-error-box' : ''}`}>
            <input onChange={validate('title')} className="form-element" ref={node => fields.title=node} id="ask-title" type="text"/>
            { titleError ? <div className="form-error">{titleError}</div> : null }
          </div>
        </div>
        <div className="form-row">
          <div className="form-label">
            <label className="form-element" for="ask-tags">Tags:</label>
          </div>
          <div className="form-input">
            <input className="form-element" ref={node => fields.tags=node} id="ask-tags" type="text"/>
          </div>
        </div>
        <div className={`form-full-row ${textError ? 'form-error-box' : ''}`}>
          <textarea onChange={validate('text')} className="form-element form-text" ref={node => fields.text=node} name="ask-text"/>
          { textError ? <div className="form-error">{textError}</div> : null }
        </div>
        <div className="form-full-row">
          <button className="form-right" onClick={post}>Post</button>
          { postError ? <div className="form-right form-error-box">{postError}</div> : null }
        </div>
      </fieldset>
    </div>
  );
};

class AskPanel extends FormContainer {
  constructor() {
    super();
    
    this.onPost = this.onPost.bind(this);
    this.onValidatePost = this.onValidatePost.bind(this);
    this.onSignup = this.onSignup.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }
  
  onValidatePost(name, value) {
    let newFormState = {
      ...this.state.form
    };

    let setState = (type, message) => {
      if (newFormState[type] !== message) {
        newFormState[type] = message;
        this.setFormState(newFormState);
      }
      return newFormState[type] === null;
    };

    switch(name) {
      case 'title':
        return setState('titleError', value ? null : 'You must specify a title');
      case 'text':
        return setState('textError', value ? null : 'You must include a question');
    }
  }
  
  onPost(title, tags, text) {
    let titleOk = this.onValidatePost('title', title);
    let textOk = this.onValidatePost('text', text);

    if (titleOk && textOk) {
      // API call and actions go here
      this.setFormState({...this.state.form, postError: null});
      ask(title, tags, text)
        .then(({quid}) => {
          showQuestion({quid, title, tags, text});
        });
    } else {
      this.setFormState({
        ...this.state.form,
        postError: 'Fix the error(s) above'
      });
    }
  }
  
  onSignup() {
    const {store} = this.context;
    store.dispatch(openModal('sign-up'))
  }
  onLogin() {
    const {store} = this.context;
    store.dispatch(openModal('login'))
  }

  render() {
    const {store} = this.context;

    const {form, redux} = this.state;
    const user = redux.user;

    return user && user.username ?
      <AskForm {...form} onPost={this.onPost} onValidate={this.onValidatePost} /> :
      <UserWall onSignup={this.onSignup} onLogin={this.onLogin} />;
  }
}
AskPanel.contextTypes = {
  store: React.PropTypes.object
};

export default AskPanel;