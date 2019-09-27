#!/usr/bin/env node

const {Command} = require('bin-tool')

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

  run ({
    argv
  }) {
    return packThen('pack')(argv)
  }
}
