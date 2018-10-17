
const {isNumber} = require('core-util-is')
const {format} = require('util')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const tmp = require('tmp')

// fail(1, 'with exit code')
// fail('foo %s', 'bar')
// fail(new Error('abc'))
exports.fail = (code, ...args) => {
  if (!isNumber(code)) {
    args.unshift(code)
    code = 1
  }

  if (args[0] instanceof Error) {
    args = [args[0].message]
  }

  console.error(chalk.red.bold(format(...args)))

  process.exit(code)
}

const error = (Ctor, ...args) => {
  if (!(Ctor.prototype instanceof Error)) {
    args.unshift(Ctor)
    Ctor = Error
  }

  return new Ctor(format(...args))
}

exports.error = error

exports.throws = (...args) => {
  throw error(...args)
}

exports.log = (...args) => {
  console.log(format(...args))
}

exports.testFiles = (files, cwd) => files
.find(file => {
  const filepath = path.join(cwd, file)

  try {
    fs.accessSync(filepath, fs.constants.R_OK)
    return true
  } catch (error) {
    return false
  }
})

exports.getTempDir = () => new Promise((resolve, reject) => {
  tmp.dir((err, dir) => {
    if (err) {
      return reject(
        error('fails to create tmp dir: %s', err.stack || err.message)
      )
    }

    resolve(dir)
  })
})
