const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

// const launches = new Map();

// let latestFlightNumber = 100;

const defaultFlightNumber = 0;

// const launch = {
//   flightNumber: 100,
//   mission: "Kepler exploration X",
//   rocket: "Explorer IS1",
//   launchDate: new Date("December 27, 2030"),
//   target: "Kepler-442 b",
//   customer: ["ZTM", "Nasa"],
//   upcoming: true,
//   success: true,
// };

// saveAllLaunch(launch);

async function existLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

async function getLatestLaunch() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return defaultFlightNumber;
  }

  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestLaunch()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customer: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveAllLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customer: ["ZTM", "NASA"],
//       flightNumber: latestFlightNumber,
//     })
//   );
// }

// launches.set(launch.flightNumber, launch);
async function getAllLaunches() {
  // return Array.from(launches.values());
  return await launchesDatabase.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
}

async function saveAllLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planets was found");
  }

  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function deleteLaunchById(launchId) {
  return await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  // aborted.upcoming = false;
  // aborted.success = false;

  // return aborted;
}

module.exports = {
  existLaunchWithId,
  scheduleNewLaunch,
  getAllLaunches,
  deleteLaunchById,
};
