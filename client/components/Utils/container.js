import React, { Component } from 'react';

class Container extends Component {
  constructor() {
    super();
    this.state = this.xform(undefined, {});
  }
  
  xform(previous, state) {
    return state;
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