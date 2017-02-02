import React from 'react';

export default class DeviceConnector extends React.Component {
  static propTypes = {
    twin: React.PropTypes.object.isRequired,
  }

  render() {
    return (
      <div>
        <form onSubmit={handleSubmit(onConnect)}>
          <Field name="hub" type="text" component={renderInput} label="Hub Address" />
          <Field name="deviceId" type="text" component={renderInput} label="Device Id" />
          <Field name="deviceKey" type="text" component={renderInput} label="Device Key" />
          <button action="submit" disabled={pristine || invalid} className="btn btn-primary">Connect</button>
        </form>
      </div>
    );
  }
}
