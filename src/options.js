const {join, resolve} = require('path')
const {isString, isNumber} = require('core-util-is')
const readGaiaPackage = require('gaia/package')

const {accessible} = require('./util')
const {throws} = require('./error')

// const GaiaConfig = shape({
//   dev: shape({
//     env: Object
//   }),

//   service: shape({
//     root: {
//       set (root, cwd) {
//         if (!isString(root)) {
//           throws(TypeError, 'service.root must be a path')
//         }

//         return path.resolve(cwd, root)
//       }
//     },

//     port: {
//       validate (port) {
//         if (!isNumber(port)) {
//           throws(TypeError, 'service.port must be a number')
//         }

//         return true
//       }
//     }
//   }),

//   docker: {
//     optional: true,
//     type: shape({
//       name: {
//         validate: isString
//       }
//     })
//   }
// })

const GAIA_CONFIG = 'gaia.config.js'

const create = gaiaConfigRequired => ({
  cwd: {
    description: 'set the current working directory, defaults to process.cwd()',
    default () {
      return process.cwd()
    },

    set (cwd) {
      return path.resolve(cwd)
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

      if (gaiaConfigRequired) {
        throws('CONFIG_REQUIRED', cwd)
      }
    },
    set (configFile) {
      if (!configFile) {
        return
      }

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
  }
})

module.exports = OPTIONS
