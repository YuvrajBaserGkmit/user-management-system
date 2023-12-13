const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let genreGrpcClient, movieGrpcClient;

const { GRPC_IP, GRPC_PORT } = process.env;

// Create and return protoDescriptor object using proto file path
const getProtoDescriptor = (protoPath) => {
  // Define options for loading the protobuf file
  const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  // Load the protobuf file and define the service
  const packageDefinition = protoLoader.loadSync(protoPath, options);
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

  return protoDescriptor;
};

// Set path of the proto file
const movieProtoPath = path.join(
  __dirname,
  '..',
  '..',
  'protos',
  'movie.proto',
);
const genreProtoPath = path.join(
  __dirname,
  '..',
  '..',
  'protos',
  'genre.proto',
);
const target = `${GRPC_IP}:${GRPC_PORT}`;

// Calling getProtoDescriptor function to get the protoDescriptor object
const genreProtoDescriptor = getProtoDescriptor(genreProtoPath);
const movieProtoDescriptor = getProtoDescriptor(movieProtoPath);

// Generate new gRPC client of GenreService
genreGrpcClient = new genreProtoDescriptor.GenreService(
  target,
  grpc.credentials.createInsecure(),
);
// Generate new gRPC client of MovieService
movieGrpcClient = new movieProtoDescriptor.MovieService(
  target,
  grpc.credentials.createInsecure(),
);

module.exports = {
  movieGrpcClient,
  genreGrpcClient,
};
