const Joi = require('joi');

const { validateRequest } = require('./../helpers/validate.helper');

// Joi schema for validating page and limit parameters in the query
const limitPageSchema = async (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().positive().default(1),
    limit: Joi.number().positive().min(1).max(100).default(10),
  });

  // Validating the request using the defined schema for the query parameters
  validateRequest(req, res, next, schema, 'query');
};

// Joi schema for validating the ID parameter in the request parameters
const idSchema = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string()
      .guid({ version: ['uuidv4'] })
      .required(),
  });

  // Validating the request using the defined schema for the request parameters
  validateRequest(req, res, next, schema, 'params');
};

module.exports = {
  limitPageSchema,
  idSchema,
};
