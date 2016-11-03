import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import app from './reducers';

const appStore = () => {
  const dispatchMiddleware = [thunk];
  if (process.env.NODE_ENV !== 'production') {
    dispatchMiddleware.push(createLogger());
  }
  
  return createStore(
    app,
    applyMiddleware(...dispatchMiddleware)
  );};

export default appStore;