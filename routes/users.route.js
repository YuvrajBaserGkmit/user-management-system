const { Router } = require('express');

const { upload } = require('./../helpers/multer.helper');

const authMiddleware = require('../middlewares/auth.middleware');

const userValidator = require('../validators/user.validator');
const commonValidator = require('../validators/common.validator');
const userController = require('../controllers/user.controller');
const userSerializer = require('../serializers/user.serializer');

const genericResponse = require('../helpers/common-function.helper');

const router = Router();

// Route for getting all users
router.get(
  '/',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('admin'),
  commonValidator.limitPageSchema,
  userController.getAllUsers,
  userSerializer.serializeUser,
  genericResponse.sendResponse,
);

// Route for getting a user by ID
router.get(
  '/:id',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('user'),
  commonValidator.idSchema,
  userController.getUserById,
  userSerializer.serializeUser,
  genericResponse.sendResponse,
);

// Route for updating a user by ID
router.patch(
  '/:id',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('user'),
  commonValidator.idSchema,
  userValidator.createUserSchema,
  userController.updateUser,
  genericResponse.sendResponse,
);

// Route for deleting a user by ID
router.delete(
  '/:id',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('admin'),
  commonValidator.idSchema,
  userController.deleteUser,
  genericResponse.sendResponse,
);

// Route for adding payment details to a user by ID
router.post(
  '/:id/payment-details',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('user'),
  commonValidator.idSchema,
  userValidator.paymentDetailSchema,
  userController.createUserPaymentDetail,
  userSerializer.serializeUserPaymentDetail,
  genericResponse.sendResponse,
);

// Route for adding user preferences by ID
router.post(
  '/:id/user-preferences',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('user'),
  commonValidator.idSchema,
  userValidator.userPreferenceSchema,
  userController.createAndSendUserPreference,
  userSerializer.serializeUserPreferences,
  genericResponse.sendResponse,
);

// Route for creating a user profile by ID
router.post(
  '/:id/profile',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('user'),
  commonValidator.idSchema,
  userValidator.userProfileSchema,
  userController.createUserProfile,
  userSerializer.serializeUserProfile,
  genericResponse.sendResponse,
);

// Route for updating a user profile by ID
router.patch(
  '/:id/profile',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('user'),
  commonValidator.idSchema,
  upload.single('profileImage'),
  userController.updateUserProfile,
  genericResponse.sendResponse,
);

module.exports = router;
