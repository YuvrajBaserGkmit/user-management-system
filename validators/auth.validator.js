const Joi = require('joi');

const { validateRequest } = require('../helpers/validate.helper');

// Defining the login schema using Joi for email and password validation
const loginSchema = async (req, res, next) => {
  // Joi schema for the login request
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required().label('Email'),
    password: Joi.string().required().label('Password'),
  });

  // Calling the validateRequest function to validate the request against the defined schema
  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  loginSchema,
};
