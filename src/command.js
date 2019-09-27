const {Command} = require('bin-tool')
const {join} = require('path')

class Main extends Command {
  constructor () {
    super()

    this.load(join(__dirname, 'command'))
  }
}
