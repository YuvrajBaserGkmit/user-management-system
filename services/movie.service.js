const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const { createProtoFile } = require('./../helpers/proto.helper');
const { sendMail } = require('./../helpers/mail.helper');
const models = require('../models');

const { MOVIE_PROTO_FILE_URL, GRPC_IP, GRPC_PORT, MAIL_USERNAME } = process.env;

// Function to retrieve all movies with pagination from gRPC server
const getAllMovies = async (payload) => {
  const { page, limit } = payload;

  // Generate the path to the protobuf file
  const protoFilePath = await createProtoFile(MOVIE_PROTO_FILE_URL);

  // Define options for loading the protobuf file
  const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  // Load the protobuf file and define the MovieService
  const packageDefinition = protoLoader.loadSync(protoFilePath, options);
  const MovieService =
    grpc.loadPackageDefinition(packageDefinition).MovieService;

  // Create a gRPC client for MovieService
  const client = new MovieService(
    `${GRPC_IP}:${GRPC_PORT}`,
    grpc.credentials.createInsecure(),
  );

  // Make a gRPC call to retrieve all movies with the specified page and limit
  let data = await new Promise((resolve, reject) => {
    client.GetAllMovies({ page: page, limit: limit }, async (error, movies) => {
      if (error) reject();
      resolve(movies);
    });
  });

  if (!data.movies.length) data = 'no movies available';

  return data;
};

// Function to retrieve user details by ID
const getMovieById = async (payload) => {
  const { id } = payload;

  // Generate the path to the protobuf file
  const protoFilePath = await createProtoFile(MOVIE_PROTO_FILE_URL);

  // Define options for loading the protobuf file
  const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  // Load the protobuf file and define the MovieService
  const packageDefinition = protoLoader.loadSync(protoFilePath, options);
  const MovieService =
    grpc.loadPackageDefinition(packageDefinition).MovieService;

  // Create a gRPC client for MovieService
  const client = new MovieService(
    `${GRPC_IP}:${GRPC_PORT}`,
    grpc.credentials.createInsecure(),
  );

  // Make a gRPC call to retrieve movie details by ID
  let data = await new Promise((resolve, reject) => {
    client.GetMovieById({ id: id }, async (error, movie) => {
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
  const { userIds, movieId } = payload;
  let userEmails = [];

  // Iterate through user IDs to fetch user emails
  for (const userId of userIds) {
    const user = await models.User.findByPk(userId);
    if (user) {
      const { email } = user;
      userEmails.push(email);
    }
  }

  // Retrieve movie details by ID
  const movieData = await getMovieById({ id: movieId });

  const mailSubject = 'New movies of your preferred genres';
  await sendMail(mailSubject, userEmails.toString(), movieData);
};

module.exports = {
  getAllMovies,
  getMovieById,
  suggestMovie,
};
