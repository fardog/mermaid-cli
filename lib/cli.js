var fs = require('fs')
  , chalk = require('chalk')
  , info = chalk.blue.bold
  , parseArgs = require('minimist')

var cli = function(options) {
  this.options = {
      alias: {
          help: 'h'
        , outputDir: 'o'
      }
    , 'boolean': ['help']
    , 'string': ['outputDir']
  }

  this.errors = []
  this.message = null

  this.helpMessage = [
      ""
    , info('Usage: mermaid [options] <file> [<file(s)>]')
    , ""
    , "Options:"
    , "  -o --outputDir: Directory to save files, will be created automatically"
    , "  -h --help:      Show this message"
    , "  --version:      Print version and quit"
  ]

  return this
}

cli.prototype.parse = function(argv, next) {
  var options = parseArgs(argv, this.options)

  if (options.version) {
    var pkg = require('../package.json')
    this.message = "version " + pkg.version
  }
  else if (options.help) {
    this.message = this.helpMessage.join('\n')
  }
  else {
    options.files = options._

    if (!options.files.length) {
      this.errors.push(new Error("You must specify at least one source file."))
    }

    // ensure that parameter-expecting options have parameters
    ;['outputDir'].forEach(function(i) {
      if(typeof options[i] !== 'undefined') {
        if (typeof options[i] !== 'string' || options[i].length < 1) {
          this.errors.push(new Error(i + " expects a value."))
        }
      }
    }.bind(this))
  }

  this.parsedOptions = options

  if (typeof next === 'function') {
    // we return the array of errors if there are any, otherwise null
    next(this.errors.length > 0 ? this.errors : null, this.message, options)
  }

  return this
}


module.exports = cli
