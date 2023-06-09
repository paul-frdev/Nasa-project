const {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  deleteLaunchById,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);

  const launches = await getAllLaunches(skip, limit);

  return res.status(200).json(launches);
}

async function httpPostLaunch(req, res) {
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

  await scheduleNewLaunch(launch);
  console.log(launch);

  return res.status(201).json(launch);
}

async function httpDeleteAllLaunches(req, res) {
  const launchId = +req.params.id;

  // if launch doesn't exist
  const existLaunch = await existLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch is not found",
    });
  }

  // launch does exist
  const aborted = await deleteLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: "Launch is not aborted",
    });
  }
  return res.status(200).json({ ok: true });
}

module.exports = {
  httpGetAllLaunches,
  httpPostLaunch,
  httpDeleteAllLaunches,
};
