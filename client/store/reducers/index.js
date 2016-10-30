import { combineReducers } from 'redux';

import user from './user';
import modal from './modal';

const app = combineReducers({
  user,
  modal
});

export default app;