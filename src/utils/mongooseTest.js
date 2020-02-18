const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongooseBeforeAll = async () => {
  try {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri);
  } catch (err) {
    console.error(err);
  }
  return mongoServer;
};

const mongooseTearDown = async (mongoServer) => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

module.exports = { mongooseBeforeAll, mongooseTearDown };
