const {isString} = require('core-util-is')
const {format} = require('util')
const fs = require('fs')
const path = require('path')

exports.fail = (code, ...args) => {
  let message

  if (isString(code)) {
    message = code
    code = 1
  } else {
    message = args.shift()
  }

  console.error(chalk.red.bold(format(message, ...args)))

  process.exit(code)
}


exports.testFiles = (files, cwd) => {
  return files
  .find(file => {
    const filepath = path.join(cwd, file)

    try {
      fs.accessSync(filepath, fs.constants.R_OK)
      return true
    } catch (error) {
      return false
    }
  })
}
