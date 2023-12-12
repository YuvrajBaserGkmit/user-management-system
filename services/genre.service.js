const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const { createProtoFile } = require('./../helpers/proto.helper');

const { GENRE_PROTO_FILE_URL, GRPC_IP, GRPC_PORT } = process.env;

// Function to retrieve all genres with pagination from gRPC server
const getAllGenres = async (payload) => {
  const { limit, page } = payload;

  // Generate the path to the protobuf file
  const protoFilePath = await createProtoFile(GENRE_PROTO_FILE_URL);

  // Define options for loading the protobuf file
  const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  // Load the protobuf file and define the GenreService
  const packageDefinition = protoLoader.loadSync(protoFilePath, options);
  const GenreService =
    grpc.loadPackageDefinition(packageDefinition).GenreService;

  // Create a gRPC client for GenreService
  const client = new GenreService(
    `${GRPC_IP}:${GRPC_PORT}`,
    grpc.credentials.createInsecure(),
  );

  // Make a gRPC call to retrieve all genres with the specified page and limit
  let data = await new Promise((resolve, reject) => {
    client.getAllGenres({ page: page, limit: limit }, async (error, genres) => {
      if (error) reject(error);
      resolve(genres);
    });
  }).catch((error) => {
    throw Error(error);
  });

  if (!data.genres.length) data = 'no genres available';

  return data;
};

module.exports = {
  getAllGenres,
};
