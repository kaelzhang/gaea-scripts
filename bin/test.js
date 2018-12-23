#!/usr/bin/env node

const {startDevAt} = require('../src/start')
const {
  fail,
  requirePath,
  spawn
} = require('../src/util')

const config = require('../src/config')

const run = async () => {
  const {
    argv: {
      _: commands
    },
    config: {
      cwd,
      gaea
    }
  } = await config.get(true)

  await startDevAt(requirePath(cwd), cwd)
  const command = commands.shift()

  try {
    await spawn(command, commands, {cwd})
  } catch (e) {
    process.exit(typeof e.code === 'number'
      ? e.code
      : 1)
    return
  }

  process.exit(0)
}

run().catch(fail)
