const express = require("express");
const cors = require("cors");
const qs = require("qs");
const { App } = require("./app");
const { buildSynonymsEndpoint } = require('./startup');

const nodeModules = { express, cors, qs };

const server = new App(nodeModules, buildSynonymsEndpoint());
server.init(8765);


