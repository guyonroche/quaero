import React, { Component } from 'react';

class SearchPanel extends Component {
  constructor() {
    super();
  }

  render() {
    let { store } = this.context;

    const state = store.getState();
    const user = state.user;

    return (
      <div className="search-panel">
        Search for questions here
      </div>
    );
  }
}
SearchPanel.contextTypes = {
  store: React.PropTypes.object
};

export default SearchPanel;