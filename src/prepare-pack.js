const {relative} = require('path')
const fs = require('fs')
const {glob, hasMagic} = require('glob-gitignore')
const Ignore = require('ignore')
const fse = require('fs-extra')
const {isArray} = require('core-util-is')
const debug = require('util').debuglog('@gaia/cli')

const {
  testFiles, getTempDir, throws, spawn
} = require('./util')
const config = require('./config')

const IGNORE_FILES = [
  '.npmignore',
  '.gitignore'
]

const README_FILES = [
  'README',
  'README.md',
  'Readme',
  'Readme.md',
  'readme',
  'readme.md'
]

const LICENSE_FILES = [
  'LICENCE',
  'LICENSE'
]

const CHANGELOG_FILES = [
  'CHANGELOG',
  'CHANGELOG.md',
  'HISTORY',
  'HISTORY.md'
]

const ALWAYS_IGNORES = [
  '.*.swp',
  '._*',
  '.DS_Store',
  '.git',
  '.hg',
  '.npmrc',
  '.lock-wscript',
  '.svn',
  '.wafpickle-*',
  'config.gypi',
  'CVS',
  'npm-debug.log',
  'node_modules'
]

const EMPTY = ''
const GAEA = 'gaia'
const REGEX_IS_DIR = /\/+$/

const isFile = filepath => !REGEX_IS_DIR.test(filepath)

const getFilesByFiles = async (files, cwd) => {
  if (!isArray(files)) {
    return throws('gaia.files must be an array')
  }

  const patterns = []
  const found = []

  files.forEach(file => {
    if (hasMagic(file)) {
      patterns.push(file)
      return
    }

    if (REGEX_IS_DIR.test(file)) {
      found.push(file.replace(REGEX_IS_DIR, EMPTY))
      return
    }

    found.push(file)
  })

  if (!patterns.length) {
    return found
  }

  const globbed = await glob(patterns, {
    cwd,
    marked: true
  })

  return found.concat(globbed)
}

const getFilesByIgnore = (cwd, patterns) => {
  const ignore = Ignore().add(ALWAYS_IGNORES)
  const ignoreFile = testFiles(IGNORE_FILES, cwd)
  if (ignoreFile) {
    ignore.add(fs.readFileSync(path.join(cwd, ignoreFile)).toString())
  }

  return glob(patterns, {
    cwd,
    ignore,
    mark: true
  })
}

const testAndAddFile = (filesToTest, files, cwd) => {
  const tested = testFiles(filesToTest, cwd)
  if (!tested) {
    return
  }

  if (files.indexOf(tested) === - 1) {
    files.push(tested)
  }
}

const checkMain = (files, pkg, cwd) => {
  const {main} = pkg
  const filesToTest = []

  if (main) {
    filesToTest.push(main)
    filesToTest.push(`${main}.js`)
  }

  testAndAddFile(filesToTest, files, cwd)
}

const getFilesToPack = async pkg => {
  const {root, protoPath} = pkg
  const relProtoPath = relative(root, protoPath)

  const files = await getFilesByIgnore(cwd, '')

  testAndAddFile(README_FILES, files, cwd)
  testAndAddFile(LICENSE_FILES, files, cwd)
  testAndAddFile(CHANGELOG_FILES, files, cwd)

  checkMain(files, pkg, cwd)

  return files.filter(isFile)
}

const copyFiles = (from, to, files) => {
  const tasks = files.map(file => fse.copy(
    path.join(from, file),
    path.join(to, file)
  ))

  return Promise.all(tasks)
}

const createDependencies = (
  original_dependencies, gaia_dependencies
) => {
  const new_dependencies = {}

  if (!(GAEA in original_dependencies)) {
    return throws('gaia must be npm installed')
  }

  new_dependencies.gaia = original_dependencies.gaia

  if (!gaia_dependencies) {
    return new_dependencies
  }

  if (!isArray(gaia_dependencies)) {
    return throws('gaia.dependencies must be an array')
  }

  gaia_dependencies.forEach(dep => {
    if (dep === GAEA) {
      return
    }

    if (!(dep in original_dependencies)) {
      return throws('depencency "%s" is not in package.dependencies')
    }

    new_dependencies[dep] = original_dependencies[dep]
  })

  return gaia_dependencies
}

const writePackage = (pkg, to) => {
  const {
    dependencies = {},
    files,
    gaia,
    ...cleaned
  } = pkg

  cleaned.dependencies = createDependencies(dependencies, gaia.dependencies)

  if (gaia.files) {
    cleaned.files = gaia.files
  }

  const package_string = JSON.stringify(cleaned, null, 2)

  fs.writeFileSync(
    path.join(to, 'package.json'),
    package_string
  )

  debug('package.json: %s', package_string)
}


// - pkg `gaia/package`
const prepare = async pkg => {
  const dir = await getTempDir()
  const files = await getFilesToPack(pkg)

  debug('files: %s', JSON.stringify(files, null, 2))

  await copyFiles(cwd, dir, files)
  writePackage(pkg, dir)

  return dir
}

const packThen = async command => {
  const {
    argv: {
      _
    },
    config: {
      cwd,
      pkg
    }
  } = await config.get(false)

  const dir = await await prepare({
    cwd, pkg
  })

  const args = [command].concat(_)

  debug('npm %s', args.join(' '))

  await spawn('npm', args, {cwd: dir})

  return {
    pkg,
    dir,
    cwd
  }
}

module.exports = {
  prepare,
  packThen
}
