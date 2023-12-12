require('dotenv').config();
const { sequelize } = require('./models');
const app = require('./app');
const { connect } = require('./helpers/redis.helper');
const { runKafkaConsumer } = require('./kafka/consumer');

const startServer = async function () {
  try {
    // check postgres connection
    await sequelize.authenticate();
    console.log(`--- connected to postgres ---`);

    // connect to redis
    await connect();
    console.log(`--- Connected to redis ---`);

    // connect to kafka consumer
    console.log(`--- starting kafka consumer ---`);
    await runKafkaConsumer();
    console.log(`--- Kafka consumer started ---\n`);

    const serverPort = process.env.SERVER_PORT || 5000;
    app.listen(serverPort);
    console.log(`--- Server started on ${serverPort} ---\n\n`);
  } catch (err) {
    console.log('server setup failed', err);
    console.log('Error: ', err.message);
  }
};

startServer();
