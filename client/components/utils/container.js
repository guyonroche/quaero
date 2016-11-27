import React, { Component } from 'react';

// A Container component is one that reacts to and controls Redux state
// This base class subscribes to the store state.
// Derived classes can supply a transform to restructure the state if it needs
// to be extended.

class Container extends Component {
  constructor(xform) {
    super();
    
    this.xform = xform || ((previous, state) => state);
  }

  componentWillMount() {
    const {store} = this.context;
    this.state = this.xform(undefined, store.getState());
  }
  
  componentDidMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.setState(this.xform(this.state, store.getState()))
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
}

export default Container;