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
    reported: React.PropTypes.any.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    onRefresh: React.PropTypes.func.isRequired,

    // http://redux-form.com/6.0.0-rc.3/docs/api/ReduxForm.md/
    initialValues: React.PropTypes.shape({
      desired: React.PropTypes.any.isRequired,
    }),
    handleSubmit: React.PropTypes.func.isRequired,
    pristine: React.PropTypes.bool.isRequired,
    invalid: React.PropTypes.bool.isRequired,
  }

  render() {
    const { pristine, invalid, handleSubmit, onUpdate, onRefresh } = this.props;
    return (
      <div className="">
        <div className="form-group">
          { /* <label htmlFor={this.props.property}>Interval [ms]</label> */ }
          <div className="input-group">
            <div className="input-group-addon">Reported</div>
            <input className="form-control" type="string" value={`${this.props.reported} @ ${new Date(this.props.lastReported)}`} disabled />
            <span className="input-group-btn">
              <button className="btn btn-primary" onClick={onRefresh}>Refresh</button>
            </span>
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit(onUpdate)}>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-addon">Desired&nbsp;&nbsp;&nbsp;</div>
              <Field name={this.props.property} component={renderInput} type={this.props.propertyType} />
              <span className="input-group-btn">
                <button action="submit" disabled={pristine || invalid} className="btn btn-primary">Update</button>
              </span>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
