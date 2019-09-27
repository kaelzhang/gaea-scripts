const {Command} = require('bin-tool')
const {join} = require('path')

module.exports = class Main extends Command {
  constructor () {
    super()

    this.load(join(__dirname, 'command'))
  }
}
