import React, { Component } from 'react';
import FormContainer from './utils/form-container';

import { openModal, askQuestion } from '../actions';

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

const AskForm = ({onPost, onValidate, titleError, textError, formError}) => {
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
            <label className="form-element" htmlFor="ask-title">Title:</label>
          </div>
          <div className={`form-input ${titleError ? 'form-error-box' : ''}`}>
            <input onChange={validate('title')} className="form-element" ref={node => fields.title=node} id="ask-title" type="text"/>
            { titleError ? <div className="form-error">{titleError}</div> : null }
          </div>
        </div>
        <div className="form-row">
          <div className="form-label">
            <label className="form-element" htmlFor="ask-tags">Tags:</label>
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
          { formError ? <div className="form-right form-error-box">{formError}</div> : null }
        </div>
      </fieldset>
    </div>
  );
};

class AskPanel extends FormContainer {
  constructor(props) {
    super(props);
    
    this.onPost = this.onPost.bind(this);
    this.onValidatePost = this.onValidatePost.bind(this);
    this.onSignup = this.onSignup.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  setValidationState(state, name, value) {
    if (state[name] !== value) {
      return {
        ...state,
        [name]: value
      };
    } else {
      return state;
    }
  }

  validateTitle(state, title) {
    return this.setValidationState(state, 'titleError', title ? null : 'You must specify a title');
  }
  validateTags(state) {
    return state;
  }
  validateText(state, text) {
    return this.setValidationState(state, 'textError', text ? null : 'You must include a question');
  }
  validateForm(state) {
    return this.setValidationState(
      state,
      'formError',
      state.titleError || state.textError ? 'Fix the error(s) above' : null
    );
  }
  
  onValidatePost(name, value) {
    let form = this.state.form;

    switch(name) {
      case 'title':
        form = this.validateTitle(form, value);
        break;
      case 'text':
        form = this.validateText(form, value);
        break;
    }

    if (form !== this.state.form) {
      this.setFormState(form);
    }
  }
  
  onPost(title, tags, text) {
    let form = this.state.form;
    form = this.validateTitle(form, title);
    form = this.validateText(form, text);
    form = this.validateForm(form);

    if (form !== this.state.form) {
      this.setFormState(form);
    }

    if (!form.formError) {
      this.dispatch(askQuestion(title, tags, text));
    }
  }
  
  onSignup() {
    this.dispatch(openModal('sign-up'))
  }
  onLogin() {
    this.dispatch(openModal('login'))
  }

  render() {
    const {form, redux} = this.state;
    const user = redux.user;

    return user && user.username ?
      <AskForm {...form} onPost={this.onPost} onValidate={this.onValidatePost} /> :
      <UserWall onSignup={this.onSignup} onLogin={this.onLogin} />;
  }
}

export default AskPanel;