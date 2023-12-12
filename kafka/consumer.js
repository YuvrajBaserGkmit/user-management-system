const { kafka } = require('./client');
const movieService = require('./../services/movie.service');

const consumer = kafka.consumer({ groupId: 'test-group' });

const runKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'suggest-movie', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { value: payload } = message;
      movieService.suggestMovie(JSON.parse(payload.toString()));
    },
  });
};

module.exports = {
  runKafkaConsumer,
};
