const {Server} = require('gaia')
const dotenv = require('dotenv')

const {log} = require('./util')

const start = ({
  cwd, config, port, dev
}) => {
  if (dev) {
    dotenv.config({
      path: cwd
    })
  }

  new Server(cwd, config).listen(port)

  log('server started at port %s', port)
}

module.exports = {
  start
}
