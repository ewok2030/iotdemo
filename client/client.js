import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from './redux/store';

// Views
import Layout from './containers/Layout';
import DeviceHome from './containers/DeviceHome';
import DeviceChart from './containers/DeviceChart';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path="/" component={Layout} >
            <IndexRoute component={DeviceHome} />
            <Route path="/device(/:deviceId)" name="device" component={DeviceChart} />
          </Route>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
