const express = require("express");
const cors = require("cors");
const qs = require("qs");
const { App } = require("./app");
const { startupTasks, buildSynonymsEndpoint } = require('./startup');

const nodeModules = { express, cors, qs };

const server = new App(nodeModules, startupTasks, buildSynonymsEndpoint());
server.init(8765);


