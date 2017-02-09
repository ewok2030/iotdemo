import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { validate, warn } from './deviceValidation';

// Form Fields
const renderField = (field, element) => {
  const hasIssue = (field.meta.touched && ((field.meta.error && 'has-error') || (field.meta.warning && 'has-warning')));
  return (
    <div className={`form-group ${hasIssue}`}>
      <label htmlFor={field.label}>{field.label}</label>
      {element}
      {field.meta.touched && (
        (field.meta.error &&
          <span className="help-block"><span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />&nbsp;{field.meta.error}</span>
        ) || (field.meta.warning &&
          <span className="help-block"><span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />&nbsp;{field.meta.warning}</span>)
      )}
    </div>);
};

const renderInput = field => (renderField(field, <input {...field.input} className="form-control" />));

@reduxForm({ form: 'DeviceConnector', validate, warn, enableReinitialize: true })
export default class DeviceConnector extends React.Component {
  static propTypes = {
    onConnect: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    pristine: React.PropTypes.bool.isRequired,
    invalid: React.PropTypes.bool.isRequired,
  }

  render() {
    const { pristine, invalid, handleSubmit, onConnect } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit(onConnect)}>
          <Field name="deviceId" type="text" component={renderInput} label="Device Id" />
          <button action="submit" disabled={pristine || invalid} className="btn btn-primary">Connect</button>
        </form>
      </div>
    );
  }
}
