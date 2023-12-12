const { commonErrorHandler } = require('../helpers/common-function.helper');
const genreService = require('../services/genre.service');

// Controller function for retrieving all genres with optional query parameters
const getAllGenres = async (req, res, next) => {
  try {
    const { query: payload } = req;

    // Calling genreService to get all genres response
    const response = await genreService.getAllGenres(payload);

    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

module.exports = {
  getAllGenres,
};
