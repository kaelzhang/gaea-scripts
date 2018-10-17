#!/usr/bin/env node

const {fail} = require('../src/util')
const {packThen} = require('../src/prepare-pack')

packThen('pack').catch(fail)
