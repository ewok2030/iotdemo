export const validate = (values) => {
  const errors = {};
  if (!values.desired) {
    // errors.reported = 'Required';
  }

  return errors;
};

export const warn = () => {
  const warnings = {};
  return warnings;
};

export default { validate, warn };
