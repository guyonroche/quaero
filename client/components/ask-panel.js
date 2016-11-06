import React, { Component } from 'react';
import Container from './utils/container';

import { openModal } from '../actions';

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

const AskForm = ({onPost}) => {
  let title, tags, text;
  return (
    <div>
      <fieldset>
        <legend> Ask a New Question </legend>
        <div className="form-row">
          <div className="form-label">
            <label className="form-element" for="ask-title">Title:</label>
          </div>
          <div className="form-input">
            <input className="form-element" ref={node => title=node} id="ask-title" type="text"/>
          </div>
        </div>
        <div className="form-row">
          <div className="form-label">
            <label className="form-element" for="ask-tags">Tags:</label>
          </div>
          <div className="form-input">
            <input className="form-element" ref={node => tags=node} id="ask-tags" type="text"/>
          </div>
        </div>
        <div className="form-full-row">
          <textarea className="form-element form-text" ref={node => text=node} name="ask-text"/>
        </div>
        <div className="form-full-row">
          <button className="form-right" onClick={() => onPost(title.value, tags.value, text.value)}>Post</button>
        </div>
      </fieldset>
    </div>
  );
};

class AskPanel extends Container {
  constructor() {
    super();
  }

  render() {
    let { store } = this.context;

    const state = store.getState();
    const user = state.user;

    return user.username ?
    <AskForm onPost={() => alert('nice post')} /> :
      <UserWall
        onSignup={() => store.dispatch(openModal('sign-up'))}
        onLogin={() => store.dispatch(openModal('login'))} />;
  }
}
AskPanel.contextTypes = {
  store: React.PropTypes.object
};

export default AskPanel;