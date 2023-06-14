const http = require("node:http");
const app = require("./app");
const mongoose = require("mongoose");


const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;
const MONGO_URL =
  "mongodb+srv://paulnetua:wQt26JBVJzxQhRdW@cluster0.f0hd7lr.mongodb.net/nasa?retryWrites=true&w=majority";
const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready");
});

mongoose.connection.on("error", (error) => {
  console.error(`Error ${error}`);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
