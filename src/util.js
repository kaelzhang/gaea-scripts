
const {isNumber} = require('core-util-is')
const spawn = require('cross-spawn')
const {format} = require('util')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const tmp = require('tmp')
const once = require('once')
const debug = require('util').debuglog('@gaia/cli')

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

const error = exports.error = (Ctor, ...args) => {
  if (!(Ctor.prototype instanceof Error)) {
    args.unshift(Ctor)
    Ctor = Error
  }

  return new Ctor(format(...args))
}

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
  } catch (_) {
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

exports.spawn = (command, args, {
  cwd = process.cwd(),
  env = process.env
} = {}) =>
  new Promise((resolve, reject) => {
    const args_string = args.length
      ? ` ${args.join(' ')}`
      : ''

    const c = command + args_string

    debug('run command: %s', c)

    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd,
      env: env || {}
    })

    reject = once(reject)

    child.on('error', reject)

    child.on('close', code => {
      if (!code) {
        return resolve()
      }

      const err = error('command `%s` exit with code %s', c, code)
      err.code = code

      reject(err)
    })
  })

const normalizeName = name => name.replace(/^@/, '').replace(/\//, '-')

exports.createPackName = pkg => {
  const {
    version,
    name
  } = pkg

  return `${normalizeName(name)}-${version}.tgz`
}

exports.requirePath = p => {
  try {
    return require(p)
  } catch (e) {
    const err = new Error(`fails to require "${p}": ${e.message}`)
    err.stack = e.stack

    throw err
  }
}
