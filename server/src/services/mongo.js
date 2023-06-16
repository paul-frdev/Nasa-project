const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready");
});

mongoose.connection.on("error", (error) => {
  console.error(`Error ${error}`);
});

async function mongoConnection() {
  return await mongoose.connect(MONGO_URL);
}

module.exports = {
  mongoConnection,
};

