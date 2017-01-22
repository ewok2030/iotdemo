import React from 'react';
import { connect } from 'react-redux';
// Components
import Example from '../components/Example/Example';
// Actions
import { getDevice } from '../redux/modules/device';

// Map store state to component's properties
const mapStateToProps = state => ({
  device: state.device.data,
});

// Map actions to component's properties
const mapDispatchToProps = dispatch => ({
  getDevice: () => {
    dispatch(getDevice());
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Demo extends React.Component {
  static propTypes = {
    
  }

  constructor(props) {
    super(props);
    this.state = {
      viewTitle: 'Example',
    };
  }

  render() {
    return (
      <div>
        <h2>{this.state.viewTitle}</h2>
        <Example />
      </div>
    );
  }
}
