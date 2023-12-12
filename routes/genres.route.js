const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const commonValidator = require('../validators/common.validator');
const genreController = require('../controllers/genre.controller');
const genericResponse = require('../helpers/common-function.helper');

const router = Router();

// Route for getting all genres from gRPC server
router.get(
  '/',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('user'),
  commonValidator.limitPageSchema,
  genreController.getAllGenres,
  genericResponse.sendResponse,
);

module.exports = router;
