const { Client } = require("redis-om");
const roomSchema = require("./models/room-model");

const client = new Client();

async function connectToRedis() {
  try {
    await client.open(process.env.REDIS_URL);
    const repository = client.fetchRepository(roomSchema);
    await repository.createIndex();
    console.log("Connected to Redis client.");
  } catch (e) {
    console.log(e);
    throw new Error("An error occurred while connecting to the database");
  }
}

module.exports = connectToRedis;
