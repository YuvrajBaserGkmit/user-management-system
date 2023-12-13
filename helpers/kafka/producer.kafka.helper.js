const { getkafkaProducer } = require('./client.kafka.helper');

// Function to send user preference using kafka producer
const sendUserPreference = async (payload) => {
  const { id, genreId } = payload;
  const producer = getkafkaProducer();

  // Send message using kafka producer
  await producer.send({
    topic: 'user-preference',
    messages: [
      {
        key: 'userPreference',
        value: JSON.stringify({
          userId: id,
          genreId: genreId,
        }),
      },
    ],
  });
};

module.exports = {
  sendUserPreference,
};
