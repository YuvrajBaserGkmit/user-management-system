const { commonErrorHandler } = require('./common-function.helper');

// Function to validate the request data
const validateRequest = (req, res, next, schema, requestParameterType) => {
  let requestData = {};

  // Check the type of the request data and assign it to requestData
  if (requestParameterType === 'body') {
    requestData = req.body;
  } else if (requestParameterType === 'query') {
    requestData = req.query;
  } else {
    requestData = req.params;
  }

  // Validate the requestData against the provided schema
  const { value, error } = schema.validate(requestData);

  if (!error) {
    if (requestParameterType === 'body') {
      req.body = value;
    } else if (requestParameterType === 'query') {
      req.query = value;
    } else {
      req.params = value;
    }

    return next();
  }

  // If there is a validation error, handle it using the commonErrorHandler
  return commonErrorHandler(
    req,
    res,
    // Remove \" from the error message string
    error.message.replace(/\"/g, ''),
    400,
    error,
  );
};

module.exports = {
  validateRequest,
};
