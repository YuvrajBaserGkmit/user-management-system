const { Kafka } = require('kafkajs');

const { KAFKA_IP, KAFKA_PORT } = process.env;

const kafka = new Kafka({
  clientId: 'myflix-demo',
  brokers: [`${KAFKA_IP}:${KAFKA_PORT}`],
});

module.exports = {
  kafka,
};
