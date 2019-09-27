#!/usr/bin/env node

const fse = require('fs-extra')
const {join} = require('path')
const {Command} = require('bin-tool')

const create = require('../options')
const {packThen} = require('../prepare-pack')
const {createPackName} = require('../src/util')

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
