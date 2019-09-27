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

    this.options = create({
      configRequired: true,
      extra: {
        dev: {
          type: 'boolean',
          description: 'whether start the server in dev mode'
        }
      }
    })
  }

  async run ({
    argv: {
      cwd,
      config: {
        service: {
          port,
          ...config
        }
      }
    }
  }) {
    await start({
      cwd,
      config,
      port
    })
  }
}
