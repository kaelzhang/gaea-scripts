const {log} = require('./util')
const config = require('./config')

const start = (gaea, gaeaConfig, dev) => {
  if (dev) {
    Object.assign(process.env, gaeaConfig.dev.env)
  }

  const {
    port,
    root
  } = gaeaConfig.service

  log('server started at port %s', port)

  gaea.server(root).listen(port)
}

const startDevAt = async (g, cwd) => {
  const {
    gaea
  } = await config.config({cwd}, true)

  start(g, gaea, true)
}

module.exports = {
  start,
  startDevAt
}
