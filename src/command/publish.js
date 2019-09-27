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

  async run ({
    argv: {
      cwd,
      pkg,
      '--': extraArgs
    }
  }) {
    prevent('gaia publish', ['run', 'publish'])

    await packThen('publish')({
      cwd,
      pkg,
      extraArgs
    })
  }
}
