const { commonErrorHandler } = require('../helpers/common-function.helper');
const authService = require('../services/auth.service');

const { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } = process.env;

// Controller function for handling user login
const loginUser = async (req, res, next) => {
  try {
    const { body: payload } = req;

    // Calling the authService to perform user login
    const response = await authService.loginUser(payload);
    const { accessToken, refreshToken } = response;

    // Setting options for the access token cookie
    const accessTokenCookieOptions = {
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION * 60 * 60 * 1000), // 2 hours
    };

    // Setting options for the refresh token cookie
    const refreshTokenCookieOptions = {
      secure: true,
      httpOnly: true,
      expires: new Date(
        Date.now() + REFRESH_TOKEN_EXPIRATION * 24 * 60 * 60 * 1000, // 30 days
      ),
    };

    // Setting cookies with the generated access and refresh tokens
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.data = 'user logged in successfully';
    res.statusCode = 200;

    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

// Controller function for handling token refresh
const refreshAccessToken = async (req, res, next) => {
  try {
    const { user: payload } = req;

    // Calling the authService to refresh the access token
    const response = await authService.refreshAccessToken(payload);
    const { accessToken } = response;

    // Setting options for the access token cookie
    const accessTokenCookieOptions = {
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION * 60 * 60 * 1000), // 2 hours
    };

    // Setting cookies with the generated access token
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);

    res.data = 'new access token generated';
    res.statusCode = 200;

    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

// Controller function for handling user logout
const logoutUser = async (req, res, next) => {
  try {
    const { cookies: payload } = req;

    // Calling the authService to delete tokens from redis cache
    const response = await authService.logoutUser(payload);

    // Clearing accessToken and refreshToken cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.data = response;
    res.statusCode = 200;

    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

module.exports = {
  loginUser,
  refreshAccessToken,
  logoutUser,
};
