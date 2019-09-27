
const {format} = require('util')
const fs = require('fs')
const path = require('path')
const tmp = require('tmp')

const {error} = require('./error')

const log = (...args) => console.log(format(...args))

const accessible = filepath => {
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
        error('ERR_CREATE_TMP', err.stack)
      )
    }

    resolve(dir)
  })
})

const normalizeName = name => name.replace(/^@/, '').replace(/\//, '-')

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
