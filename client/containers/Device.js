import React from 'react';
import { connect } from 'react-redux';
// Components
import DeviceTwinEditor from '../components/DeviceTwinEditor/DeviceTwinEditor';
import DeviceChart from '../components/DeviceChart/DeviceChart';
// Actions
import { getTwin, updateTwin, openConnection, closeConnection, initMessages, clearMessages } from '../redux/modules/device';

// Map store state to component's properties
const mapStateToProps = state => ({
  deviceId: state.device.deviceId,
  twin: state.device.twin,
  isConnected: state.device.isConnected,
  messages: state.device.messages,
});

// Map actions to component's properties
const mapDispatchToProps = dispatch => ({
  getTwin: (deviceId) => {
    dispatch(getTwin(deviceId));
  },
  updateTwin: (deviceId, patch) => {
    dispatch(updateTwin(deviceId, patch));
  },
  initMessages: (deviceId, hours) => {
    dispatch(initMessages(deviceId, hours));
  },
  openConnection: () => {
    dispatch(openConnection());
  },
  closeConnection: () => {
    dispatch(closeConnection());
  },
  clearMessages: () => {
    dispatch(clearMessages());
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Device extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    deviceId: React.PropTypes.string,
    twin: React.PropTypes.object,
    isConnected: React.PropTypes.bool.isRequired,
    getTwin: React.PropTypes.func.isRequired,
    updateTwin: React.PropTypes.func.isRequired,
    openConnection: React.PropTypes.func.isRequired,
    closeConnection: React.PropTypes.func.isRequired,
    initMessages: React.PropTypes.func.isRequired,
    messages: React.PropTypes.array.isRequired,
    clearMessages: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    twin: null,
    deviceId: null,
    initHours: 1,
  }

  constructor(props) {
    super(props);
    this.state = {
      viewTitle: 'Device Monitor',
    };
    // Initialize the properties here
    const { params } = this.props;
    const { deviceId } = params;
    this.props.getTwin(deviceId);

    let hours = 1;
    if ('hours' in this.props.location.query) {
      hours = Number(this.props.location.query.hours);
    }

    // Initialize
    this.props.initMessages(deviceId, hours);
  }

  handleUpdate = patch => this.props.updateTwin(this.props.deviceId, patch);
  handleRefresh = () => this.props.getTwin(this.props.deviceId);
  handleClear = () => this.props.clearMessages();
  handleConnect = () => {
    if (this.props.isConnected) {
      this.props.closeConnection();
    } else {
      this.props.openConnection();
    }
  }

  render() {
    let editor = null;
    if (this.props.twin != null) {
      editor = (<DeviceTwinEditor
        onUpdate={this.handleUpdate}
        onRefresh={this.handleRefresh}
        property="interval" propertyType="number"
        lastReported={this.props.twin.reported.$metadata.interval.$lastUpdated}
        reported={this.props.twin.reported.interval}
      />);
    }

    let device = <button className="btn btn-danger" onClick={this.handleConnect}>{this.props.deviceId}</button>;
    if (this.props.isConnected) {
      device = <button className="btn btn-success" onClick={this.handleConnect}>{this.props.deviceId}</button>;
    }

    let temp = -1;
    if (this.props.messages.length > 0) {
      temp = this.props.messages[this.props.messages.length - 1].temperature;
    }
    let humid = -1;
    if (this.props.messages.length > 0) {
      humid = this.props.messages[this.props.messages.length - 1].humidity;
    }

    return (
      <div>
        <h3>
          Device: {device}
          <p className="pull-right">Humidity:<span className="label label-default">{humid.toFixed(2)} %</span></p>
          <p className="pull-right">Temperature:<span className="label label-default">{temp.toFixed(2)} C</span></p>
          <p className="pull-right">Messages:<span className="label label-default">{this.props.messages.length}</span>
            <button type="button" className="btn btn-primary" onClick={this.handleClear} ><span className="glyphicon glyphicon-remove" /></button>
          </p>
        </h3>
        {editor}
        <DeviceChart messages={this.props.messages} />
      </div>
    );
  }
}
