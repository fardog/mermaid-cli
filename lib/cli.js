var fs = require('fs')
  , parseArgs = require('minimist')

var cli = function(options) {
  this.options = {
      alias: {
        help: 'h'
        , columns: 'c'
      }
    , 'boolean': ['help']
    , 'string': []
  }

  this.errors = []
  this.message = null

  this.helpMessage = [
      "No one can help you, yet."
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
    options.file = options._[0]

    // ensure that parameter-expecting options have parameters
    ;['file'].forEach(function(i) {
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
