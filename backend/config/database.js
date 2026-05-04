// Set up mongoose connection
const mongoose = require("mongoose");

const mongoDB = process.env.MONGODB_URI;

async function connectMongoose() {
  await mongoose.connect(mongoDB);
  console.log("MongoDB connection successful : ", mongoDB);

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });
}

async function disconnectDB() {
  await mongoose.disconnect();
  console.log("MongoDB connection closed");
}

try {
  connectMongoose();
} catch (err) {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
}

module.exports = { connectMongoose, disconnectDB };