import React from 'react';
import Container from './container';

class FormContainer extends Container {
  constructor() {
    super();
  }

  xform(previous, redux) {
    // want to store both redux state and local form state
    return previous ?
    { form: previous.form, redux} :
    { form: {}, redux};
  }
  
  setFormState(form) {
    const redux = this.state.redux;
    this.setState({form, redux});
  }
}

export default Container;