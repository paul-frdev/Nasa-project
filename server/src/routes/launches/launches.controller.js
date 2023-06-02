const {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  deleteLaunchById,
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpPostLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.target ||
    !launch.launchDate
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (
    launch.launchDate.toString() === "Invalid Date" ||
    isNaN(launch.launchDate)
  ) {
    return res.status(400).json({
      error: "Invalid launch Date",
    });
  }

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpDeleteAllLaunches(req, res) {
  const launchId = +req.params.id;

  // if launch doesn't exist
  if (!existLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  // launch does exist
  const aborted = deleteLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpPostLaunch,
  httpDeleteAllLaunches,
};
