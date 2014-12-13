var os = require('os')
  , fs = require('fs')
  , path = require('path')
  , spawn = require('child_process').spawn

var through = require('through')
  , mkdirp = require('mkdirp')
  , phantomPath = require('phantomjs').path

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
    , output = writeSvgData(outputDir)

  files.forEach(function(file) {
    phantomArgs.push(file)
  })

  mkdirp(outputDir, function(err) {
    if (err) {
      throw err
      return
    }
    phantom = spawn(phantomPath, phantomArgs)

    phantom.stderr.pipe(process.stderr)
    if (options.svg) {
      phantom.stdout.pipe(output)
    }
  })
}

function writeSvgData(outputDir) {
  var stream = through(write)
    , outputDir = outputDir || process.cwd()
    , fd
    , filename
    , tmpbuff
    , dest

  return stream

  function write(buf) {
    var offset = 0
      , wrote = false

    for (var i = 0; i < buf.length; i++) {
      if (buf[i] === 0x02) {
        // end the filename, create a new file
        dest = through()
        dest.pipe(fs.createWriteStream(path.join(outputDir, filename + ".svg")))
        filename = undefined
        offset = i + 1
      }
      else if (buf[i] === 0x01) {
        // create a new filename
        filename = ''
        if (dest) {
          // if we have a destination, write out buffer to this point
          dest.queue(buf.slice(offset, i))
        }
      }
      else if (buf[i] === 0x03) {
        // got end of that file, queue the buffer
        dest.queue(buf.slice(offset, i))
        wrote = true
      }
      else if (filename !== undefined) {
        // if filename is defined, we're currently writing it
        filename += String.fromCharCode(buf[i])
      }
    }

    // we have a destination, but haven't written the buffer, queue it
    if (dest && !wrote) {
      dest.queue(buf.slice(offset, buf.length))
    }
  }
}
