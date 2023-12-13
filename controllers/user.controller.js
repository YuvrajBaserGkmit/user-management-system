const { commonErrorHandler } = require('../helpers/common-function.helper');
const userService = require('../services/user.service');

const { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } = process.env;

// Controller function for creating a new user
const createUser = async (req, res, next) => {
  try {
    const { body: payload } = req;

    // Calling userService to create a new user and getting the response
    const response = await userService.createUser(payload);
    const { accessToken, refreshToken } = response;

    // Setting options for the access token and refresh token cookie
    const accessTokenCookieOptions = {
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION * 60 * 60 * 1000), // 2 hours
    };
    const refreshTokenCookieOptions = {
      secure: true,
      httpOnly: true,
      expires: new Date(
        Date.now() + REFRESH_TOKEN_EXPIRATION * 24 * 60 * 60 * 1000, // 30 days
      ),
    };

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    // Setting response body data of the new user and status code
    res.data = response;
    res.statusCode = 201;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

// Controller function for retrieving all users with optional query parameters
const getAllUsers = async (req, res, next) => {
  try {
    const { query: payload } = req;

    // Calling userService to get all users response
    const response = await userService.getAllUsers(payload);

    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

// Controller function for retrieving a user by ID
const getUserById = async (req, res, next) => {
  try {
    const { params: payload } = req;

    // Calling userService to get a user by ID and getting the response
    const response = await userService.getUserById(payload);

    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

// Controller function for updating a user
const updateUser = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { ...body, ...params };

    // Calling userService to update a user and getting the response
    const response = await userService.updateUser(payload);

    // Setting the response data and passing control to the next middleware
    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

// Controller function for deleting a user
const deleteUser = async (req, res, next) => {
  try {
    const { params, query } = req;
    const payload = { ...params, ...query };

    // Calling userService to delete a user and getting the response
    const response = await userService.deleteUser(payload);

    // Setting the response data and passing control to the next middleware
    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

// Controller function for creating a new payment detail for a user
const createUserPaymentDetail = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { ...params, ...body };

    // Calling userService to create a payment detail and getting the response
    const response = await userService.createUserPaymentDetail(payload);

    res.data = response;
    res.statusCode = 201;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

// Controller function for creating a new user profile
const createUserProfile = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { ...params, ...body };

    // Calling userService to create a user profile and getting the response
    const response = await userService.createUserProfile(payload);

    // Setting the response data and status code, and passing control to the next middleware
    res.data = response;
    res.statusCode = 201;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

// Controller function for creating and sending user preferences using kafka producer
const createAndSendUserPreference = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { ...params, ...body };

    // Calling userService to create and send user preference using kafka producer
    const response = await userService.createAndSendUserPreference(payload);

    // Setting the response data and status code, and passing control to the next middleware
    res.data = response;
    res.statusCode = 201;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

// Controller function for updating user profile details, including uploading a profile image
const updateUserProfile = async (req, res, next) => {
  try {
    const { file, params } = req;
    const payload = { ...file, ...params };

    // Calling userService to update user profile and getting the response
    const response = await userService.updateUserProfile(payload);

    // Setting the response data and passing control to the next middleware
    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  createUserPaymentDetail,
  createUserProfile,
  createAndSendUserPreference,
  updateUserProfile,
};
