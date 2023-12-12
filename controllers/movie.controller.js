const { commonErrorHandler } = require('../helpers/common-function.helper');
const movieService = require('../services/movie.service');

// Controller function for retrieving all movies from gRPC server
const getAllMovies = async (req, res, next) => {
  try {
    const { query: payload } = req;

    // Calling movieService to get all movies response
    const response = await movieService.getAllMovies(payload);

    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

// Controller function for retrieving a movie by ID from gRPC server
const getMovieById = async (req, res, next) => {
  try {
    const { params: payload } = req;

    // Calling movieService to get a movie by ID and getting the response
    const response = await movieService.getMovieById(payload);

    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

// Controller function for testing movie suggestions
const testMovieSuggestions = async (req, res, next) => {
  try {
    const { body: payload } = req;

    // Calling movieService to test movie suggestions
    const response = await movieService.suggestMovie(payload);

    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  testMovieSuggestions,
};
