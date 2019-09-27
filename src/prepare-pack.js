const {relative, join} = require('path')
const fs = require('fs')
const {glob} = require('glob-gitignore')
const Ignore = require('ignore')
const fse = require('fs-extra')
const debug = require('util').debuglog('@gaia/cli')
const execa = require('execa')

const {testFiles, getTempDir} = require('./util')

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

const REGEX_IS_DIR = /\/+$/

const isFile = filepath => !REGEX_IS_DIR.test(filepath)

const getFilesByIgnore = (cwd, patterns) => {
  const ignore = Ignore().add(ALWAYS_IGNORES)
  const ignoreFile = testFiles(IGNORE_FILES, cwd)
  if (ignoreFile) {
    ignore.add(fs.readFileSync(join(cwd, ignoreFile)).toString())
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

const getFilesToPack = async pkg => {
  const {root, proto_path} = pkg
  const relProtoPath = relative(root, proto_path)

  // `package.gaia.protos` is the entries of proto files but not all of them,
  // so we need to pack all proto files under protoPath
  const files = await getFilesByIgnore(root, `${relProtoPath}/**/*.proto`)

  testAndAddFile(README_FILES, files, root)
  testAndAddFile(LICENSE_FILES, files, root)
  testAndAddFile(CHANGELOG_FILES, files, root)

  return files.filter(isFile)
}

const copyFiles = (from, to, files) => {
  const tasks = files.map(file => fse.copy(
    join(from, file),
    join(to, file)
  ))

  return Promise.all(tasks)
}

const writePackage = (pkg, to) => {
  const {
    proto_dependencies,
    pkg: packageJson
  } = pkg

  const cleaned = {
    ...packageJson
  }

  const dependencies = {}

  for (const name of proto_dependencies) {
    dependencies[name] = cleaned.dependencies[name]
  }

  cleaned.dependencies = dependencies

  const package_string = JSON.stringify(cleaned, null, 2)

  fs.writeFileSync(
    join(to, 'package.json'),
    package_string
  )

  debug('package.json: %s', package_string)
}

// - pkg `gaia/package`
const prepare = async pkg => {
  const dir = await getTempDir()
  const files = await getFilesToPack(pkg)

  debug('files: %s', JSON.stringify(files, null, 2))

  await copyFiles(pkg.root, dir, files)
  writePackage(pkg, dir)

  return dir
}

const normalizeName = name => name.replace(/^@/, '').replace(/\//, '-')

const createPackName = pkg => {
  const {
    version,
    name
  } = pkg

  return `${normalizeName(name)}-${version}.tgz`
}

const packThen = command => async argv => {
  const {
    _,
    pkg
  } = argv

  const dir = await await prepare(pkg)

  const args = [command].concat(_)

  debug('npm %s', args.join(' '))

  await execa('npm', args, {
    cwd: dir,
    stdio: 'inherit'
  })

  const packName = createPackName(pkg.pkg)

  return {
    dir,
    pack: {
      name: packName,
      path: join(dir, packName)
    }
  }
}

module.exports = {
  prepare,
  packThen
}
