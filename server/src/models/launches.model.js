const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

// const launches = new Map();

// let latestFlightNumber = 100;

const defaultFlightNumber = 0;

// const launch = {
//   flightNumber: 100, // flight_number
//   mission: "Kepler exploration X", // name
//   rocket: "Explorer IS1", // rocket.name
//   launchDate: new Date("December 27, 2030"), // date_local
//   target: "Kepler-442 b", // not applicable yet
//   customer: ["ZTM", "Nasa"], //payload.customers
//   upcoming: true, // upcoming
//   success: true, // success
// };

// saveAllLaunch(launch);

async function findLaunch(filter) {
  return launchesDatabase.findOne(filter);
}

async function existLaunchWithId(launchId) {
  return await findLaunch({
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
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planets was found");
  }

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
async function getAllLaunches(skip, limit) {
  // return Array.from(launches.values());
  return await launchesDatabase
    .find(
      {},
      {
        __v: 0,
        _id: 0,
      }
    )
    .sort({ flightNumber: -1 })
    .skip(skip)
    .limit(limit);
}

async function saveAllLaunch(launch) {
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

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading data from spacex api...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading spacex data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = await response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    //TODO: populate launches collection
    saveAllLaunch(launch);
  }
}

async function loadLaunchesData(params) {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data is already loaded");
  } else {
    await populateLaunches();
  }
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
  loadLaunchesData,
};
