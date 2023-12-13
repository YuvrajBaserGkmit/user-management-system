const { genreGrpcClient } = require('../helpers/grpc/client.grpc.helper');

// Function to retrieve all genres with pagination from gRPC server
const getAllGenres = async (payload) => {
  const { limit, page } = payload;

  // Make a gRPC call to retrieve all genres with the specified page and limit
  let data = await new Promise((resolve, reject) => {
    genreGrpcClient.getAllGenres(
      { page: page, limit: limit },
      async (error, genres) => {
        if (error) reject(error);
        resolve(genres);
      },
    );
  }).catch((error) => {
    throw Error(error);
  });

  // Check if there is no content available
  if (!data.genres.length) data = 'no genres available';

  return data;
};

module.exports = {
  getAllGenres,
};
