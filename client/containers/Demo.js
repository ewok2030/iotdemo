import React from 'react';
import { connect } from 'react-redux';
// Components
import DeviceTwinEditor from '../components/DeviceTwinEditor/DeviceTwinEditor';
// Actions
import { getTwin, updateTwin } from '../redux/modules/device';

// Map store state to component's properties
const mapStateToProps = state => ({
  deviceId: state.device.deviceId,
  twin: state.device.twin,
  isConnected: state.device.isConnected,
});

// Map actions to component's properties
const mapDispatchToProps = dispatch => ({
  getTwin: (deviceId) => {
    dispatch(getTwin(deviceId));
  },
  updateTwin: (deviceId, patch) => {
    dispatch(updateTwin(deviceId, patch));
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Demo extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired,
    deviceId: React.PropTypes.string,
    twin: React.PropTypes.object,
    isConnected: React.PropTypes.bool.isRequired,
    getTwin: React.PropTypes.func.isRequired,
    updateTwin: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      viewTitle: 'IoT Hub Demo',
    };
    // Initialize the properties
    const { params } = this.props;
    const { deviceId } = params;
    this.props.getTwin(deviceId);
  }

  handleUpdate = patch => this.props.updateTwin(this.props.deviceId, patch);

  render() {
    return (
      <div>
        <h2>{this.state.viewTitle}</h2>
        <h3>{this.props.deviceId}</h3>
        <DeviceTwinEditor
          onUpdate={this.handleUpdate}
          property="interval" propertyType="number"
          lastReported={this.props.twin.reported.$metadata.interval.$lastUpdated}
          reported={this.props.twin.reported.interval}
        />
      </div>
    );
  }
}
