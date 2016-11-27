import React from 'react';
import Container from './container';

// A FormContainer is a bi-state Component that processes both Redux
// and Form state. Form state may be anything that doesn't need to be
// stored in the application (i.e. Redux) state (e.g. error messages, etc.)

// TODO: Could see about applying Redux principles to form state.
class FormContainer extends Container {
  constructor() {
    const xform = (previous, redux) => previous ?
      { form: previous.form || {}, redux} :
      { form: {}, redux};

    super(xform);
  }

  setFormState(form) {
    const redux = this.state.redux;
    this.setState({form, redux});
  }
}

export default FormContainer;