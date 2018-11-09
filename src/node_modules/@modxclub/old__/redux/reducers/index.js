import { combineReducers } from 'redux';
import userReducer from './userReducer';
import proxyReducer from './proxyReducer';
import documentReducer from './documentReducer';

export default combineReducers({
  user: userReducer,
  proxy: proxyReducer,
  document: documentReducer,
});
