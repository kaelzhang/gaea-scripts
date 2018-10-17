#!/usr/bin/env node

// Start a gaea server

const start = require('../src/start')
const {fail} = require('../src/util')

require('../src/config').get(true)
.then(({
  config: {
    cwd,
    gaea
  }
}) => {
  start(require(cwd), gaea)
})
.catch(fail)
