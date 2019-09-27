#!/usr/bin/env node

const {Command} = require('bin-tool')
const fse = require('fs-extra')
const {join} = require('path')

const create = require('../options')
const {packThen} = require('../prepare-pack')

module.exports = class PackCommand extends Command {
  get description () {
    return 'create a tarball from a package'
  }

  constructor () {
    super()

    this.options = create()
  }

  async run ({
    argv: {
      cwd,
      pkg,
      '--': extraArgs
    }
  }) {
    const {
      pack: {
        name,
        path
      }
    } = await packThen('pack')({
      cwd,
      pkg,
      extraArgs
    })

    await fse.copy(
      path,
      join(cwd, name)
    )
  }
}
