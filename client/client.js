import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from './redux/store';

// Views
import Layout from './containers/Layout';
import Demo from './containers/Demo';

const app = document.getElementById('app');
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Layout} >
        <Route path="/device(/:deviceId)" name="device" component={Demo} />
      </Route>
    </Router>
  </Provider>, app);
