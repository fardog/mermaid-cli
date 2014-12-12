#!/usr/bin/env node

var fs = require('fs')
  , chalk = require('chalk')
  , error = chalk.bold.red
  , Cli = require('../lib/cli.js')
  , lib = require('../lib')

var cli = new Cli().parse(process.argv.slice(2), function(err, message, options) {
  if (err) {
    console.error(
      error('\nYou had errors in your syntax. Use --help for further information.')
    )
    err.forEach(function (e) {
      console.error(e.message)
    })

    return
  }
  else if (message) {
    console.log(message)

    return
  }

  lib.process(options.file, options)
});
