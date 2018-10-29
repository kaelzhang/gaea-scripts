#!/usr/bin/env node

const {fail} = require('../src/util')
const {packThen} = require('../src/prepare-pack')
const {prevent} = require('../src/prevent')

prevent('gaea-publish', ['run', 'publish'])

packThen('publish').catch(fail)
