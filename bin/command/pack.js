#!/usr/bin/env node

const fse = require('fs-extra')
const path = require('path')
const {fail, createPackName} = require('../src/util')
const {packThen} = require('../src/prepare-pack')

packThen('pack')
.then(({
  pkg,
  dir,
  cwd
}) => {
  const pack_name = createPackName(pkg)
  return fse.copy(
    path.join(dir, pack_name),
    path.join(cwd, pack_name)
  )
})
.catch(fail)
