const { Router } = require('express');

const router = Router();

const authMiddleware = require('../middlewares/auth.middleware');

const userValidator = require('../validators/user.validator');
const userController = require('../controllers/user.controller');
const userSerializer = require('../serializers/user.serializer');

const authValidator = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

const genericResponse = require('../helpers/common-function.helper');

// Route for new user registration and user login
router.post(
  '/signup',
  userValidator.createUserSchema,
  userController.createUser,
  userSerializer.serializeUser,
  genericResponse.sendResponse,
);

// Route for user login, setting access token and refresh token in cookies
router.post(
  '/login',
  authValidator.loginSchema,
  authController.loginUser,
  genericResponse.sendResponse,
);

// Route for refreshing the access token using the refresh token
router.post(
  '/refresh-token',
  authMiddleware.checkToken(false),
  authController.refreshAccessToken,
  genericResponse.sendResponse,
);

// Route for user logout, revoking the access token
router.post(
  '/logout',
  authMiddleware.checkToken(true),
  authController.logoutUser,
  genericResponse.sendResponse,
);

module.exports = router;
