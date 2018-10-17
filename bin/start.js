#!/usr/bin/env node

// Start a gaea server

const {
  argv,
  config
} = require('../src/config').get(true)

const start = require('../src/start')

start(require(config.cwd), config.gaea.service)

// console.log(argv, config.cwd, config.debug, config.pkg, config.gaea)
// console.log(config.gaea.service.root, config.gaea.service.port)
// console.log(config.gaea.docker.name)
