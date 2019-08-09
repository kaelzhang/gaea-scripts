const {log} = require('./util')
const config = require('./config')

const start = (gaia, gaiaConfig, dev) => {
  if (dev) {
    Object.assign(process.env, gaiaConfig.dev.env)
  }

  const {
    port,
    root
  } = gaiaConfig.service

  log('server started at port %s', port)

  gaia.server(root).listen(port)
}

const startDevAt = async (g, cwd) => {
  const {
    gaia
  } = await config.config({cwd}, true)

  start(g, gaia, true)
}

module.exports = {
  start,
  startDevAt
}
