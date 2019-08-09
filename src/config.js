const path = require('path')
const {shape} = require('skema')
const minimist = require('minimist')
const {isString, isNumber} = require('core-util-is')

const {throws, testFiles} = require('./util')

const GaiaConfig = shape({
  dev: shape({
    env: Object
  }),

  service: shape({
    root: {
      set (root, cwd) {
        if (!isString(root)) {
          throws(TypeError, 'service.root must be a path')
        }

        return path.resolve(cwd, root)
      }
    },

    port: {
      validate (port) {
        if (!isNumber(port)) {
          throws(TypeError, 'service.port must be a number')
        }

        return true
      }
    }
  }),

  docker: {
    optional: true,
    type: shape({
      name: {
        validate: isString
      }
    })
  }
})

const Config = shape({
  cwd: {
    default () {
      return process.cwd()
    },

    set (cwd) {
      return path.resolve(cwd)
    }
  },

  pkg: {
    default: null,
    set () {
      try {
        return require(path.join(this.parent.cwd, 'package.json'))
      } catch (e) {
        throws('fails to read package.json: %s', e.stack || e.message)
      }
    }
  },

  gaia: {
    default: null,
    set (_, gaiaConfigRequired) {
      const {cwd} = this.parent
      const gaiarcFile = testFiles(['.gaiarc.js'], cwd)

      if (gaiarcFile) {
        return GaiaConfig.from(require(path.join(cwd, gaiarcFile)), [cwd])
      }

      if (gaiaConfigRequired) {
        throws('.gaiarc.js is not found')
      }

      return null
    }
  }
})

const config = async (options, gaiaConfigRequired) =>
  Config.from(options, [gaiaConfigRequired])

const get = async gaiaConfigRequired => {
  const argv = minimist(process.argv.slice(2))

  return {
    argv,
    config: await config(argv, gaiaConfigRequired)
  }
}

module.exports = {
  get,
  config
}
