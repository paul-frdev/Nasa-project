const { parse } = require("csv-parse");
const fs = require("node:fs");
const path = require("node:path");

const planets = require("./planets.mongo");

// const results = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

// const promise = new Promise((resolve, reject) => { resolve(42) })
// promise.then((res) => {
//
// })
//  await result = await promise;

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(parse({ comment: "#", columns: true }))
      .on("data", async (data) => {
        if (isHabitable(data)) {
          // return results.push(data);
          // insert + update = mongoose it prevents a lot of calls and dublicates of saving data to database = upsert
          savePlanet(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      })
      .on("end", () => {
        console.log("done");
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find({});
}

async function savePlanet(planet) {
  try {
    return await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`Could not save error ${error}`);
  }
}

// parse()

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
