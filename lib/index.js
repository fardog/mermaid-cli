var os = require('os')
  , path = require('path')
  , spawn = require('child_process').spawn

var phantomPath = require('phantomjs').path

var phantomscript = path.join(__dirname, 'phantomscript.js')

module.exports = { process: processMermaid }

function processMermaid(files, _options) {
  var options = _options || {}
    , outputDir = options.outputDir || process.cwd()
    , phantomArgs = [
          phantomscript
        , outputDir
        , options.png
      ]

  files.forEach(function(file) {
    phantomArgs.push(file)
  })

  phantom = spawn(phantomPath, phantomArgs)

  phantom.stdout.pipe(process.stdout)
  phantom.stderr.pipe(process.stderr)
}
