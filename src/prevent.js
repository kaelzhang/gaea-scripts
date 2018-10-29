// Prevent certain npm commands

const {
  fail
} = require('./util')

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
  const message = `"${command}" is not allowed to be executed inside "${npm_command}"`

  fail(new Error(message))
}

module.exports = {
  prevent
}
