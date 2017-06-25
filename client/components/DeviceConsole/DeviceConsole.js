import React from 'react';

export default class DeviceConsole extends React.Component {
  static propTypes = {
    messages: React.PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Device Messages
        </div>
        <ul className="list-group">
          {this.props.messages.map(m => <li key={m.telemetry.timestamp} className="list-group-item">{JSON.stringify(m)}</li>)}
        </ul>
      </div>
    );
  }
}
