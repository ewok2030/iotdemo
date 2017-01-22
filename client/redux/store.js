import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

// modules
import device from './modules/device';

const middleware = applyMiddleware(promise(), thunk, logger());

const reducer = combineReducers({
  device,
});

export default createStore(reducer, middleware);
