const express = require("express");
const { httpGetAllLaunches, httpPostLaunch } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpPostLaunch);

module.exports = launchesRouter;
