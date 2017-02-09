import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { validate, warn } from './deviceTwinValidation';

// Form Fields
const renderField = (field, element) => {
  const hasIssue = (field.meta.touched && ((field.meta.error && 'has-error') || (field.meta.warning && 'has-warning')));
  return (
    <div className={`form-group ${hasIssue}`}>
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

@reduxForm({ form: 'DeviceTwinEditor', validate, warn, enableReinitialize: true })
export default class DeviceTwinEditor extends React.Component {
  static propTypes = {
    property: React.PropTypes.string.isRequired,
    propertyType: React.PropTypes.string.isRequired,
    lastReported: React.PropTypes.string.isRequired,
    reported: React.PropTypes.string.isRequired,
    onUpdate: React.PropTypes.func.isRequired,

  // http://redux-form.com/6.0.0-rc.3/docs/api/ReduxForm.md/
    handleSubmit: React.PropTypes.func.isRequired,
    reset: React.PropTypes.func.isRequired,
    pristine: React.PropTypes.bool.isRequired,
    invalid: React.PropTypes.bool.isRequired,
    submitting: React.PropTypes.bool.isRequired,
  }

  render() {
    const { pristine, reset, invalid, submitting, handleSubmit, onUpdate } = this.props;
    return (
      <div className="container-fluid">
        <form className="form-inline" onSubmit={handleSubmit(onUpdate)}>
          <div className="form-group">
            <label htmlFor={this.props.property}>{this.props.property}</label>
            <input className="form-control" type={this.props.propertyType} disabled>{this.props.reported}</input>
            <div className="input-group-addon">{this.props.lastReported}</div>
          </div>

          <Field name={this.props.property} type={this.props.propertyType} component={renderInput} />

          <button action="submit" disabled={pristine || invalid} className="btn btn-primary">Update</button>
          <button type="button" disabled={pristine || submitting} onClick={reset} className="btn btn-default">Reset</button>
        </form>
      </div>
    );
  }
}
