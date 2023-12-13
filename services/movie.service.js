const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const models = require('../models');
const { sendMail } = require('./../helpers/mail.helper');
const { movieGrpcClient } = require('../helpers/grpc/client.grpc.helper');

// Function to retrieve all movies with pagination from gRPC server
const getAllMovies = async (payload) => {
  const { page, limit } = payload;

  // Make a gRPC call to retrieve all movies with the specified page and limit
  let data = await new Promise((resolve, reject) => {
    movieGrpcClient.GetAllMovies(
      { page: page, limit: limit },
      async (error, movies) => {
        if (error) reject();
        resolve(movies);
      },
    );
  });

  // Check if there is no content available
  if (!data.movies.length) data = 'no movies available';

  return data;
};

// Function to retrieve user details by ID
const getMovieById = async (payload) => {
  const { id } = payload;

  // Make a gRPC call to retrieve movie details by ID
  let data = await new Promise((resolve, reject) => {
    movieGrpcClient.GetMovieById({ id: id }, async (error, movie) => {
      if (error) {
        reject(error);
      }
      resolve(movie);
    });
  }).catch((error) => {
    // Handle gRPC error responses
    if (error.code === 5) {
      const err = new Error(error.details);
      err.statusCode = 404;
      throw err;
    } else throw Error(error);
  });

  return data;
};

// Function to suggest a movie to a list of users via email
const suggestMovie = async (payload) => {
  const { userId, movieId } = payload;
  const user = await models.User.findByPk(userId);
  const { email } = user;

  // Retrieve movie details by ID
  const movieData = await getMovieById({ id: movieId });

  const mailSubject = 'New movies of your preferred genres';

  // Send mail to all the users with movie data in the mail body
  await sendMail(mailSubject, email.toString(), movieData);
};

module.exports = {
  getAllMovies,
  getMovieById,
  suggestMovie,
};
