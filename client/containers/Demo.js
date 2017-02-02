import React from 'react';
import { connect } from 'react-redux';
// Components
import DeviceConnector from '../components/DeviceConnector/DeviceConnector';
// Actions
import { connectDevice } from '../redux/modules/device';

// Map store state to component's properties
const mapStateToProps = state => ({
  device: state.device.data,
  isConnected: state.device.isConnected,
});

// Map actions to component's properties
const mapDispatchToProps = dispatch => ({
  connectDevice: () => {
    dispatch(connectDevice());
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Demo extends React.Component {
  static propTypes = {
    connectDevice: React.PropTypes.func.isRequired,
    isConnected: React.PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      viewTitle: 'IoT Hub Demo',
    };
  }

  handleConnect = device => this.props.connectDevice(device);

  render() {
    return (
      <div>
        <h2>{this.state.viewTitle}</h2>
        <DeviceConnector onConnect={this.handleConnect} isConnected={this.props.isConnected} />
      </div>
    );
  }
}
