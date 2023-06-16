const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://paulnetua:wQt26JBVJzxQhRdW@cluster0.f0hd7lr.mongodb.net/nasa?retryWrites=true&w=majority";

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
