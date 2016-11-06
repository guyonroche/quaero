import React, { Component } from 'react';

class Container extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState())
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
}

export default Container;