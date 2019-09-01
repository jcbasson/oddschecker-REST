const express = require("express");
const cors = require("cors");
const qs = require("qs");
const { App } = require("./app");
const { startupTasks, buildOddsCheckerEndpoint } = require('./startup');

const nodeModules = { express, cors, qs };
startupTasks();
const server = new App(nodeModules, buildOddsCheckerEndpoint());
server.init(8766);


