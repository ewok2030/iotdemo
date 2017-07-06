import React from 'react';
import { connect } from 'react-redux';
// Components
import DeviceList from '../components/DeviceList/DeviceList';
// Actions
import { getDevices } from '../redux/modules/device';

// Map store state to component's properties
const mapStateToProps = state => ({
  devices: state.device.devices,
});

// Map actions to component's properties
const mapDispatchToProps = dispatch => ({
  getDevices: () => {
    dispatch(getDevices());
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class DeviceHome extends React.Component {
  static propTypes = {
    devices: React.PropTypes.array,
    getDevices: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    devices: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      viewTitle: 'Device Home',
    };
    this.props.getDevices();
  }

  render() {
    return (
      <DeviceList devices={this.props.devices} />
    );
  }
}
