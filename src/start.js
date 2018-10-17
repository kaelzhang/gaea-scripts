const {log} = require('./util')

module.exports = (gaea, service, env) => {
  if (env) {
    Object.assign(process.env, env)
  }

  const {
    port,
    root
  } = service

  log('server started at port %s', port)

  gaea.server(root).listen(port)
}
