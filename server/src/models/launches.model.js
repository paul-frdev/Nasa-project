const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  missionName: "Kepler exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-442 b",
  customer: ["ZTM", "Nasa"],
  upcoming: true,
  success: true,
};

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customer: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
}

launches.set(launch.flightNumber, launch);
function getAllLaunches() {
  return Array.from(launches.values());
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
};
