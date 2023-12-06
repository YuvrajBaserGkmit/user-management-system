const bcrypt = require('bcrypt');
const crypto = require('crypto');
const razorpayIfsc = require('ifsc'); // Library for validating IFSC codes

const models = require('../models');
const { uploadUserProfileImage } = require('../helpers/aws.helper');
const { set } = require('../helpers/redis.helper');

const {
  SECRET_KEY_ACCESS_TOKEN,
  SECRET_KEY_REFRESH_TOKEN,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} = process.env;

// Function to create a new user
const createUser = async (payload) => {
  const { email, password } = payload;

  // Checking if the provided email already exists in the database
  const userEmailExist = await models.User.findOne({ where: { email } });
  if (userEmailExist) {
    const error = new Error('Email already used');
    error.statusCode = 409;
    throw error;
  }

  // Hashing the password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10);
  const userPayload = {
    email: email,
    password: hashedPassword,
  };

  // Creating a new user in the database
  const user = await models.User.create(userPayload);
  const { id: userId } = user;

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

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;

  return user;
};

// Function to retrieve all users with pagination
const getAllUsers = async (payload) => {
  const { page, limit } = payload;

  const offset = (page - 1) * limit;

  // Querying the database for users with associated user profiles
  const users = await models.User.findAndCountAll({
    offset: offset,
    limit: limit,
    attributes: {
      exclude: ['password', 'created_at', 'updated_at', 'deleted_at'],
    },
  });

  // Handling case where no users are found
  if (!users.rows.length) {
    const error = new Error('No content available');
    error.statusCode = 204;
    throw error;
  }

  return users;
};

// Function to retrieve user details by ID
const getUserById = async (payload) => {
  const { id } = payload;

  // Querying the database for a user with the specified ID and associated user
  const user = await models.User.findByPk(id, {
    attributes: {
      exclude: ['password', 'created_at', 'updated_at', 'deleted_at'],
    },
  });

  // Handling case where the user is not found
  if (!user) {
    const error = new Error('User not exists');
    error.statusCode = 404;
    throw error;
  } else {
    return user;
  }
};

// Function to update user details
const updateUser = async (payload) => {
  const { id, email, password } = payload;

  // Checking if the user with the specified ID exists
  const userExists = await models.User.findByPk(id);
  if (!userExists) {
    const error = new Error('User not exists');
    error.statusCode = 404;
    throw error;
  }

  // Checking if the email is being updated
  if (userExists.email !== email) {
    const error = Error('Email cannot be updated');
    error.statusCode = 422;
    throw error;
  }

  // Checking if the password needs to be updated and hashing it
  const isPasswordSame = await bcrypt.compare(password, userExists.password);
  const newHashedPassword = isPasswordSame
    ? userExists.password
    : await bcrypt.hash(password, 10);

  // Updating user details in the database
  const userUpdatePayload = {
    email: email,
    password: newHashedPassword,
  };

  await models.User.update(userUpdatePayload, { where: { id } });
  return 'User updated successfully';
};

// Function to delete a user by ID
const deleteUser = async (payload) => {
  const { id } = payload;
  let message = 'User deleted successfully';

  // Checking if the user with the specified ID exists
  const userExists = await models.User.findByPk(id);
  if (!userExists) {
    const error = new Error('User not exists');
    error.statusCode = 404;
    throw error;
  } else {
    // Deleting the user from the database
    await models.User.update(
      { email: `${userExists.email}_deleted_${new Date()}` },
      { where: { id } },
    );
    await models.User.destroy({ where: { id } });
    return message;
  }
};

// Function to create a new payment detail for a user
const createUserPaymentDetail = async (payload) => {
  const { accountNumber, bankName, ifsc, id } = payload;
  const isValidIfsc = razorpayIfsc.validate(ifsc);

  // Checking if the provided account number already exists in the database
  const bankExist = await models.PaymentDetail.findOne({
    where: { account_number: accountNumber },
  });
  if (bankExist) {
    const error = new Error('Account number already exists');
    error.statusCode = 409;
    throw error;
  }

  // Checking if the provided IFSC code is valid
  if (!isValidIfsc) {
    const error = new Error('Invalid IFSC code');
    error.statusCode = 422;
    throw error;
  }

  // Creating a new payment detail for the user in the database
  const paymentDetailPayload = {
    ifsc: ifsc,
    account_number: accountNumber,
    bank_name: bankName,
    user_id: id,
  };

  const paymentDetail = await models.PaymentDetail.create(paymentDetailPayload);

  return paymentDetail;
};

// Function to create a new user profile
const createUserProfile = async (payload) => {
  const { firstName, lastName, phoneNumber, id } = payload;

  // Checking if a user profile already exists for the specified user
  const profileExist = await models.UserProfile.findOne({
    where: { user_id: id },
  });
  if (profileExist) {
    const error = new Error('User profile already exists');
    error.statusCode = 409;
    throw error;
  }

  // Creating a new user profile in the database
  const userProfilePayload = {
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    user_id: id,
  };
  const userProfile = await models.UserProfile.create(userProfilePayload);

  return userProfile;
};

// Function to create user preferences
const createUserPreference = async (payload) => {
  const { genre, id } = payload;

  const genreExist = await models.UserPreference.findOne({
    where: { user_id: id, genre: genre },
  });
  if (genreExist) {
    const error = new Error('User already have this preference');
    error.statusCode = 409;
    throw error;
  }

  // Creating user preferences in the database
  const userPreferencePayload = {
    genre: genre.toLowerCase().trim(),
    user_id: id,
  };
  const userPreference = await models.UserPreference.create(
    userPreferencePayload,
  );

  return userPreference;
};

// Function to update user profile details, including uploading a profile image
const updateUserProfile = async (payload) => {
  const { id, buffer, originalname, mimetype } = payload;

  // Uploading the user profile image to AWS S3 and getting the image URLs
  const url = await uploadUserProfileImage(buffer, originalname, mimetype, id);

  // Updating user profile details in the database with the new image URLs
  const userProfilePayload = {
    image_url: url.profileImageUrl,
    thumbnail_url: url.imageThumbnailUrl,
  };
  await models.UserProfile.update(userProfilePayload, {
    where: { user_id: id },
  });

  return 'User profile image added successfully';
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  createUserPaymentDetail,
  createUserProfile,
  updateUserProfile,
  createUserPreference,
};
