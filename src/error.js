const {Errors} = require('err-object')

const {E, error} = new Errors({
  filterStackSources: [
    __dirname
  ]
})

E('CONFIG_REQUIRED',
  'gaia.config.js not found in "%s" or you should specify --config option')

E('CONFIG_NO_ACCESS', 'config file "%s" is not accessible')

E('ERR_LOAD_CONFIG', 'fails to load config file "%s", reason:\n%s')

E('NPM_SCRIPT_NOT_ALLOW',
  '"%s" is not allowed to be executed inside "%s"')

E('ERR_CREATE_TMP', 'fails to create tmp dir, reason:\n%s')

const throws = (...args) => {
  throw error(...args)
}

module.exports = {
  throws,
  error
}
