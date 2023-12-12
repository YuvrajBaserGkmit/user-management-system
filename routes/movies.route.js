const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const commonValidator = require('../validators/common.validator');
const movieController = require('../controllers/movie.controller');
const genericResponse = require('../helpers/common-function.helper');

const router = Router();

// Route for getting all movies from gRPC server
router.get(
  '/',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('user'),
  commonValidator.limitPageSchema,
  movieController.getAllMovies,
  genericResponse.sendResponse,
);

// Route for getting a movie by ID from gRPC server
router.get(
  '/:id',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('user'),
  movieController.getMovieById,
  genericResponse.sendResponse,
);

// Route for testing the movie-suggestions according to user preference
router.get(
  '/test/movie-suggestions',
  authMiddleware.checkToken(true),
  authMiddleware.checkPermission('user'),
  movieController.testMovieSuggestions,
  genericResponse.sendResponse,
);

module.exports = router;
