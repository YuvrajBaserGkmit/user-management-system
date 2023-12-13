require('dotenv').config();
const { sequelize } = require('./models');
const app = require('./app');
const { connect } = require('./helpers/redis.helper');
const { createProtoFile } = require('./helpers/grpc/proto.grpc.helper');
const kafkaClient = require('./helpers/kafka/client.kafka.helper');
const {
  suggestMovieConsumer,
} = require('./helpers/kafka/consumer.kafka.helper');

const { MOVIE_PROTO_FILE_URL, GENRE_PROTO_FILE_URL } = process.env;

const startServer = async function () {
  try {
    // check postgres connection
    await sequelize.authenticate();

    // connect to redis
    await connect();

    // Generate all the proto files
    await createProtoFile(MOVIE_PROTO_FILE_URL);
    await createProtoFile(GENRE_PROTO_FILE_URL);
    console.log(`--- Proto files generated ---`);

    // connect to kafka producer
    await kafkaClient.connectKafkaProducer();
    console.log(`--- Connected to kafka producer ---`);

    // connect to kafka consumer
    console.log(`--- starting kafka consumer ---`);
    await kafkaClient.connectKafkaConsumer();
    console.log(`--- Kafka consumer started ---`);

    // Subscribe kafka topic
    await kafkaClient.subscribeKafkaTopic();
    console.log(`--- Subscribed to kafka topic ---\n`);

    // Run suggestMovieConsumer
    await suggestMovieConsumer();
    console.log(`--- Suggest movie consumer running ---\n`);

    const serverPort = process.env.SERVER_PORT || 5000;
    app.listen(serverPort);
    console.log(`--- Server started on ${serverPort} ---\n\n`);
  } catch (err) {
    console.log('server setup failed', err);
    console.log('Error: ', err.message);
  }
};

startServer();
