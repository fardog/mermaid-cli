var os = require('os')
  , path = require('path')
  , execFile = require('child_process').execFile

var phantomPath = require('phantomjs').path

var phantomscript = path.join(__dirname, 'phantomscript.js')

module.exports = { process: process }

function process(file, _options) {
  this.file = file
  this.options = _options || {}
  this.outputDir = this.options.outputDir

  if (!this.outputDir) {
    this.outputDir = __dirname
  }

  execFile(phantomPath, [
      phantomscript
    , this.file
    , this.outpuDir
  ], onProcessed)

  function onProcessed(err, stdout, stderr) {
    if (err) {
      console.error(new Error(err))
      return
    }

    console.log(stdout)
  }
}

function isNumber(n) {
  if(Number.isNaN(+n)) {
    return false
  }
  return true
}
