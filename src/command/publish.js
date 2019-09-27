const {Command} = require('bin-tool')

const create = require('../options')
const {packThen} = require('../prepare-pack')
const {prevent} = require('../prevent')

module.exports = class PackCommand extends Command {
  get description () {
    return 'publish a gaia package'
  }

  constructor () {
    super()

    this.options = create()
  }

  run ({
    argv
  }) {
    prevent('gaia publish', ['run', 'publish'])

    return packThen('publish')(argv)
  }
}
