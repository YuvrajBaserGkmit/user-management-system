const redis = require('redis');

const { REDIS_HOST, REDIS_PORT } = process.env;

// Function to create a new Redis client
const getClient = () => redis.createClient(REDIS_HOST, REDIS_PORT);

const client = getClient();

// Function to connect the Redis client
const connect = () => client.connect();

// Function to get the value of a key from Redis
const get = (key) => client.get(key);

// Function to delete a key from Redis
const del = (key) => client.del(key);

// Function to reset the Redis client
const reset = () => client.reset();

// Function to set a key-value pair in Redis with an expiration time in seconds
const set = (key, value, timeInSeconds = 1) =>
  client.set(key, value, { EX: timeInSeconds });

module.exports = {
  connect,
  get,
  set,
  del,
  reset,
};
