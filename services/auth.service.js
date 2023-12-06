const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { set, del, get } = require('../helpers/redis.helper');
const models = require('../models');

const {
  SECRET_KEY_ACCESS_TOKEN,
  SECRET_KEY_REFRESH_TOKEN,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} = process.env;

// Function for user login
const loginUser = async (payload) => {
  const { email, password } = payload;

  // Checking if a user with the provided email exists
  const userExist = await models.User.findOne({ where: { email } });
  if (!userExist) {
    const error = Error(`User with email ${email} not exists`);
    error.statusCode = 404;
    throw error;
  }
  const { id: userId, email: userEmail, password: userPassword } = userExist;

  // Comparing the provided password with the hashed password stored in the database
  const match = await bcrypt.compare(password, userPassword);
  if (!match) {
    const error = Error(`Wrong email or password`);
    error.statusCode = 401;
    throw error;
  }

  // Creating access and refresh tokens using user id and secret keys
  const accessToken = crypto
    .createHmac('sha256', SECRET_KEY_ACCESS_TOKEN)
    .update(userId)
    .digest('hex');
  const refreshToken = crypto
    .createHmac('sha256', SECRET_KEY_REFRESH_TOKEN)
    .update(userId)
    .digest('hex');

  // Storing accessToken and refreshToken in Redis cache with expiration times
  await set(accessToken, userId, ACCESS_TOKEN_EXPIRATION * 60 * 60);
  await set(refreshToken, userId, REFRESH_TOKEN_EXPIRATION * 24 * 60 * 60);

  const result = {
    id: userId,
    email: userEmail,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  return result;
};

// Function for refreshing access tokens
const refreshAccessToken = async (payload) => {
  const { id: userId } = payload;

  // generate a new accessToken and set it in redis
  const accessToken = crypto
    .createHmac('sha256', SECRET_KEY_ACCESS_TOKEN)
    .update(userId)
    .digest('hex');
  await set(accessToken, userId, ACCESS_TOKEN_EXPIRATION * 60 * 60);

  const result = {
    id: userId,
    accessToken: accessToken,
  };

  return result;
};

// Function for user logout
const logoutUser = async (payload) => {
  const { accessToken, refreshToken } = payload;

  const isAccessTokenCached = await get(accessToken);
  const isRefreshTokenCached = await get(refreshToken);

  // Delete access token and refresh token from redis
  if (isAccessTokenCached) await del(accessToken);
  if (isRefreshTokenCached) await del(refreshToken);

  return 'user logout successful';
};

module.exports = {
  loginUser,
  refreshAccessToken,
  logoutUser,
};
