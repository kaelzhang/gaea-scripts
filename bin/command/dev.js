#!/usr/bin/env node

// Start a dev server

const {start} = require('../src/start')
const {fail} = require('../src/util')

require('../src/config').get(true)
.then(({
  config: {
    cwd,
    gaia
  }
}) => {
  start(require(cwd), gaia, true)
})
.catch(fail)
