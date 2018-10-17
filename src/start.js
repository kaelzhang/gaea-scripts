const {log} = require('./util')

module.exports = (gaea, gaeaConfig, dev) => {
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
