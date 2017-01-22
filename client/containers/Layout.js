import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default class Layout extends React.Component {
  static propTypes = {
    location: React.PropTypes.object.isRequired,
    children: React.PropTypes.object.isRequired,
  }
  render() {
    return (
      <div>
        <Header location={this.props.location} />
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              {this.props.children}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
