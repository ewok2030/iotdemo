import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { reducer as form } from 'redux-form';

// modules
import device from './modules/device';

// redux-socket
const socket = io();
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

// const middleware = applyMiddleware(socketIoMiddleware, promise(), thunk, logger());
const middleware = applyMiddleware(promise(), thunk, socketIoMiddleware, logger());
// const middleware = applyMiddleware(promise(), thunk, logger());

const reducer = combineReducers({
  form,
  device,
});

export default createStore(reducer, middleware);
