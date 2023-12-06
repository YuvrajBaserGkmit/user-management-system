const models = require('../models');
const { commonErrorHandler } = require('../helpers/common-function.helper');
const { get } = require('../helpers/redis.helper');

// Middleware to check if the token (access or refresh token) is valid
const checkToken = (isAccessToken) => {
  return async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = req.cookies;
      // Choose token type based on isAccessToken flag
      const token = isAccessToken ? accessToken : refreshToken;

      // If no token is provided, deny access
      if (!token) {
        throw new Error('Access denied');
      }

      // Retrieve user ID associated with the token from Redis
      const id = await get(token);

      // Find user in the database using the retrieved ID
      const user = await models.User.findByPk(id);
      if (!user) throw new Error('Access denied');
      req.user = user;

      next();
    } catch (error) {
      res.statusCode = 401;
      commonErrorHandler(req, res, error.message, res.statusCode, error);
    }
  };
};

// Middleware to check if the user has the required role to access the endpoint
const checkPermission = (role) => {
  return async (req, res, next) => {
    try {
      // If the user's role matches the required role, or if the required role is 'user', proceed to the next middleware function
      if (req.user.role === role || role === 'user') {
        next();
      } else {
        // If the user's role does not match the required role, deny access
        throw Error(
          `you don't have required permission to access this api endpoint`,
        );
      }
    } catch (error) {
      res.statusCode = 403;
      commonErrorHandler(req, res, error.message, res.statusCode, error);
    }
  };
};

module.exports = {
  checkToken,
  checkPermission,
};
