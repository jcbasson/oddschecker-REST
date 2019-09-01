const express = require("express");
const cors = require("cors");
const qs = require("qs");
const { App } = require("./app");
const { startupTasks, buildOddsCheckerEndpoint } = require('./startup');

const nodeModules = { express, cors, qs };

const server = new App(nodeModules, startupTasks, buildOddsCheckerEndpoint());
server.init(8766);


