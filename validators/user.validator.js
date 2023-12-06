const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const { validateRequest } = require('../helpers/validate.helper');

// Defining password complexity options
const complexityOptions = {
  min: 8,
  max: 16,
  lowercase: 1,
  uppercase: 1,
};

// Validate user schema using Joi for user creation
const createUserSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().trim().label('Email'),
    password: passwordComplexity(complexityOptions)
      .required()
      .label('Password'),
  });

  // Validate request body against the schema
  validateRequest(req, res, next, schema, 'body');
};

// Validate payment detail schema using Joi
const paymentDetailSchema = (req, res, next) => {
  const schema = Joi.object({
    ifsc: Joi.string().regex(/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/),
    accountNumber: Joi.string().regex(/^\d{9,18}$/),
    bankName: Joi.string().label('Bank Name'),
  });

  // Validate request body against the schema
  validateRequest(req, res, next, schema, 'body');
};

// Validate user profile schema using Joi
const userProfileSchema = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).label('First Name'),
    lastName: Joi.string().min(3).max(30).label('Last Name'),
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .label('Phone Number'),
  });

  // Validate request body against the schema
  validateRequest(req, res, next, schema, 'body');
};

// Validate user preference schema using Joi
const userPreferenceSchema = (req, res, next) => {
  const schema = Joi.object({
    genre: Joi.string().min(3).max(30).label('Genre'),
  });

  // Validate request body against the schema
  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  createUserSchema,
  paymentDetailSchema,
  userProfileSchema,
  userPreferenceSchema,
};
