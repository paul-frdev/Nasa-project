const express = require("express");
const { httpGetAllLaunches, httpPostLaunch, httpDeleteAllLaunches } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpPostLaunch);
launchesRouter.delete("/:id", httpDeleteAllLaunches)

module.exports = launchesRouter;
