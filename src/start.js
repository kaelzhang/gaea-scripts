const {Server} = require('gaia')
const {log} = require('./util')

const start = ({
  cwd, config, port
}) => {
  const server = new Server(cwd, config).listen(port)

  log('server started at port %s', port)

  return server
}

module.exports = {
  start
}
