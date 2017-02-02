export const validate = (values) => {
  const errors = {};
  if (!values.hub) {
    errors.hub = 'Required';
  }

  if (!values.deviceId) {
    errors.deviceId = 'Required';
  }

  if (!values.deviceKey) {
    errors.deviceKey = 'Required';
  }

  return errors;
};

export const warn = () => {
  const warnings = {};
  return warnings;
};

export default { validate, warn };
