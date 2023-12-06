// Common error handler for handling errors
const commonErrorHandler = async (
  req,
  res,
  message,
  statusCode = 500,
  error = null,
) => {
  // Default error message
  let errorMessage = 'Something went wrong. Please try again';

  // Using provided message if available
  if (message) {
    errorMessage = message;
  }

  // Handling error message from the caught error
  if (error && error.message) {
    message = error.message;
  }

  req.error = error;

  const response = {
    statusCode,
    data: {},
    message: errorMessage,
  };

  // Sending the error response with the specified status code
  res.status(statusCode).json(response);
};

// Generic response sender middleware for sending success responses
const sendResponse = async (req, res) => {
  // Constructing the success response object
  const response = {
    statusCode: res.statusCode,
    data: res.data || {},
    message: 'Success',
  };

  // Sending the success response with the specified status code
  return res.status(res.statusCode).json(response);
};

module.exports = {
  commonErrorHandler,
  sendResponse,
};
