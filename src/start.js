const {Server} = require('gaia')
const {log} = require('./util')

const start = ({pkg, config}) => {
  const {
    server,
    port
  } = config

  log('server started at port %s', port)

  new Server(root, server).listen(port)
}

module.exports = {
  start
}
