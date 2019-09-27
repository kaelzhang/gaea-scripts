const {join} = require('path')
const {Server} = require('gaia')
const dotenv = require('dotenv')

const {log} = require('./util')

const start = ({
  cwd, config, port, dev
}) => {
  if (dev) {
    dotenv.config({
      path: join(cwd, '.env')
    })
  }

  new Server(cwd, config).listen(port)

  log('server started at port %s', port)
}

module.exports = {
  start
}
