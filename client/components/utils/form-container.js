import React from 'react';
import Container from './container';

class FormContainer extends Container {
  constructor() {
    const xform = (previous, redux) => previous ?
      { form: previous.form, redux} :
      { form: {}, redux};

    super(xform);
  }

  setFormState(form) {
    const redux = this.state.redux;
    this.setState({form, redux});
  }
}

export default FormContainer;