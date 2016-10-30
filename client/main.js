import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './app';
import createAppStore from './store';

ReactDOM.render(
  <Provider store={createAppStore()}>
    <App />
  </Provider>,
  document.getElementById('app')
);