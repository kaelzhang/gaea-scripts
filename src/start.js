const {Server} = require('gaia')
const {log} = require('./util')

const start = ({pkg, config}) => {
  const {service} = config
  const {port} = service

  log('server started at port %s', port)

  new Server(pkg.root, service).listen(port)
}

module.exports = {
  start
}
