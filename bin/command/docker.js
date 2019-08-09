#!/usr/bin/env node

// Docker build a gaia server

// docker build -t ost.ai/member-service:`node -e "console.log(require('./package.json').version)" 2> /dev/null` .

const {fail, spawn} = require('../src/util')

require('../src/config').get(true)
.then(({
  config: {
    cwd,
    pkg,
    gaia: {
      docker
    }
  }
}) => {
  if (!docker) {
    return fail('docker field is required in .gaiarc.js')
  }

  const args = ['build', '-t', `${docker.name}:${pkg.version}`, '.']

  return spawn('docker', args, {cwd})
})
.catch(fail)
