// Prevent certain npm commands
const {throws} = require('./error')

const npm_commands = process.env.npm_config_argv
  ? JSON.parse(process.env.npm_config_argv).original
  : null

const prevent = (command, not_allow) => {
  if (!npm_commands) {
    return
  }

  const is_equal = not_allow.every((c, i) => c === npm_commands[i])

  if (!is_equal) {
    return
  }

  const npm_command = not_allow.join(' ')
  throws('NPM_SCRIPT_NOT_ALLOW', command, npm_command)
}

module.exports = {
  prevent
}
