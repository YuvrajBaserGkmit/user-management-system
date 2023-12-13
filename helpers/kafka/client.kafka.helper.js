const { Kafka } = require('kafkajs');
const { Partitioners } = require('kafkajs');

const { KAFKA_IP, KAFKA_PORT } = process.env;

// Create a new kafka client by using clientId and brokers
const kafka = new Kafka({
  clientId: 'myflix-demo',
  brokers: [`${KAFKA_IP}:${KAFKA_PORT}`],
});

// Create a kafka consumer using kafka client
const kafkaConsumer = kafka.consumer({ groupId: 'test-group' });

// Create kafka producer using kafka client
const kafkaProducer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

const getkafkaConsumer = () => kafkaConsumer;
const getkafkaProducer = () => kafkaProducer;

// Connect to kafka consumer
const connectKafkaConsumer = async () => await kafkaConsumer.connect();

// Connect to kafka producer
const connectKafkaProducer = async () => await kafkaProducer.connect();

// Subscribe to kafka topic
const subscribeKafkaTopic = async () =>
  await kafkaConsumer.subscribe({
    topic: 'suggest-movie',
    fromBeginning: true,
  });

module.exports = {
  getkafkaConsumer,
  getkafkaProducer,
  connectKafkaConsumer,
  connectKafkaProducer,
  subscribeKafkaTopic,
};
