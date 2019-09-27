// Start a gaia server

const {Command} = require('bin-tool')

const create = require('../options')
const {start} = require('../start')

module.exports = class StartCommand extends Command {
  get description () {
    return 'start as a gaia server'
  }

  constructor () {
    super()

    this.options = create(true)
  }

  run ({
    argv
  }) {
    return start(argv)
  }
}
