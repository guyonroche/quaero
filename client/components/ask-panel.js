import React, { Component } from 'react';
import FormContainer from './utils/form-container';

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

const AskForm = ({onPost, errors}) => {
  let title, tags, text;

  // errors may contain specific validation errors itemised to each field
  // if errors && specific error, then display field appropriately

  return (
    <div>
      <fieldset>
        <legend>Ask a New Question</legend>
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
    
    this.onPost = this.onPost.bind(this);
  }
  
  onPost(title, tags, text) {
    // bit of cleanup and xform
    title = title.trim();
    tags = tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    text = text.trim();
    
    // validation => move validation to own method
    // if error(s) found then set state with errors
    // will want to listen to onChange events to set/clear validation
    
    // API call and action!
  }

  render() {

    const state = store.getState();
    const user = state.user;

    return user.username ?
      <AskForm onPost={this.onPost}  /> :
      <UserWall
        onSignup={() => store.dispatch(openModal('sign-up'))}
        onLogin={() => store.dispatch(openModal('login'))} />;
  }
}
AskPanel.contextTypes = {
  store: React.PropTypes.object
};

export default AskPanel;