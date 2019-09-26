
const {isNumber} = require('core-util-is')
const spawn = require('cross-spawn')
const {format} = require('util')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const tmp = require('tmp')

const log = (...args) => console.log(format(...args))

const accessible = file => {
  try {
    fs.accessSync(filepath, fs.constants.R_OK)
    return true
  } catch (_) {
    return false
  }
}

const testFiles = (files, cwd) => files
.find(file => {
  const filepath = path.resolve(cwd, file)
  return accessible(filepath)
})

const getTempDir = () => new Promise((resolve, reject) => {
  tmp.dir((err, dir) => {
    if (err) {
      return reject(
        error('fails to create tmp dir: %s', err.stack || err.message)
      )
    }

    resolve(dir)
  })
})

const createPackName = pkg => {
  const {
    version,
    name
  } = pkg

  return `${normalizeName(name)}-${version}.tgz`
}

module.exports = {
  log,
  accessible,
  testFiles,
  getTempDir,
  createPackName
}
