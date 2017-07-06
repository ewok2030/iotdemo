import React from 'react';
import { Link } from 'react-router';

export default class DeviceList extends React.Component {
  static propTypes = {
    devices: React.PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Devices
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Device Id</th>
              <th>Connection State</th>
              <th>Status</th>
              <th>Cloud-to-Device Message Count</th>
            </tr>
          </thead>
          <tbody>
            {this.props.devices.map(d =>
              <tr key={d.deviceId}>
                <td><Link to={`/device/${d.deviceId}`}>{d.deviceId}</Link></td>
                <td>{d.connectionState}</td>
                <td>{d.status}</td>
                <td>{d.cloudToDeviceMessageCount}</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}
