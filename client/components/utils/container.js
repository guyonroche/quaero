import React, { Component } from 'react';

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