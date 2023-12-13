const { getkafkaConsumer } = require('./client.kafka.helper');
const movieService = require('../../services/movie.service');

// Function to connect kafka consumer and then subscribe kafka topic and run the consumer
const suggestMovieConsumer = async () => {
  try {
    const consumer = getkafkaConsumer();
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { value: payload } = message;
        try {
          const parsedPayload = JSON.parse(payload.toString());
          // Calling suggestMovie method of movieService to send new movie notification
          await movieService.suggestMovie(parsedPayload);
        } catch (error) {
          console.error(`Failed to parse payload or suggest movie: ${error}`);
        }
      },
    });
  } catch (error) {
    console.error(`Failed to connect, subscribe or run the consumer: ${error}`);
  }
};

module.exports = {
  suggestMovieConsumer,
};
