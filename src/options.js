const {join, resolve} = require('path')
const readGaiaPackage = require('gaia/package')
const dotenv = require('dotenv')

const {accessible} = require('./util')
const {throws} = require('./error')

const GAIA_CONFIG = 'gaia.config.js'

const create = ({
  // run in dev
  dev,
  // whether gaia.config.js or --config is required
  configRequired,
  // extra options
  extra = {}
} = {}) => ({
  ...extra,
  cwd: {
    description: 'set the current working directory, defaults to process.cwd()',
    default () {
      return process.cwd()
    },

    set (cwd) {
      cwd = resolve(cwd)

      if (dev || this.parent.dev) {
        dotenv.config({
          path: join(cwd, '.env')
        })
      }

      return resolve(cwd)
    }
  },

  pkg: {
    enumerable: false,
    default: null,
    set () {
      const {cwd} = this.parent
      return readGaiaPackage(cwd)
    }
  },

  config: {
    enumerable: false,
    default () {
      const {cwd} = this.parent

      const configFile = join(cwd, GAIA_CONFIG)

      if (accessible(configFile)) {
        return configFile
      }

      if (configRequired) {
        throws('CONFIG_REQUIRED', cwd)
      }
    },
    set (configFile) {
      if (!configFile) {
        return
      }

      const {cwd} = this.parent

      configFile = resolve(cwd, configFile)

      if (!accessible(configFile)) {
        throws('CONFIG_NO_ACCESS', configFile)
      }

      try {
        return require(configFile)
      } catch (err) {
        throws('ERR_LOAD_CONFIG', configFile, err.stack)
      }
    }
  },
  ...extra
})

module.exports = create
