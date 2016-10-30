import { createStore, applyMiddleware } from 'redux';
// import createLogger from 'redux-logger';
// import thunk from 'redux-thunk';

import app from './reducers';

const appStore = () => {
  return createStore(app);
};

export default appStore;