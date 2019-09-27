// Start a gaia server

const {Command} = require('bin-tool')
const execa = require('execa')

const create = require('../options')
const {start} = require('../start')
const {log} = require('../util')

module.exports = class TestCommand extends Command {
  get description () {
    return 'start the dev server and run tests'
  }

  constructor () {
    super()

    this.options = create({
      configRequired: true,
      dev: true
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
      },
      '--': commands
    }
  }) {
    const server = await start({
      cwd,
      config,
      port
    })

    const command = commands.shift()
    await execa(command, commands, {
      cwd,
      stdio: 'inherit',
      env: {
        ...process.env,
        GAIA_SERVER_HOST: `localhost:${port}`
      }
    })

    await server.close()

    log('server gracefully closed')
    process.exit(0)
  }
}
