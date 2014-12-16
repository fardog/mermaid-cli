var fs = require('fs')
  , path = require('path')

var test = require('tape')
  , async = require('async')
  , clone = require('clone')
  , rimraf = require('rimraf')

var mermaid = require('../lib')

var singleFile = {
        files: ['examples/test.mermaid']
      , outputDir: 'test/tmp/'
    }
  , multiFile = {
        files: ['examples/test.mermaid', 'examples/test2.mermaid']
      , outputDir: 'test/tmp/'
    }


test('output of single png', function(t) {
  t.plan(3)

  var expected = ['test.mermaid.png']

  opt = clone(singleFile)
  opt.png = true

  mermaid.process(opt.files, opt, function(code) {
    t.equal(code, 0, 'has clean exit code')

    verifyFiles(expected, opt.outputDir, t)
  })
})

test('output of multiple png', function(t) {
  t.plan(3)

  var expected = ['test.mermaid.png', 'test2.mermaid.png']

  opt = clone(multiFile)
  opt.png = true

  mermaid.process(opt.files, opt, function(code) {
    t.equal(code, 0, 'has clean exit code')

    verifyFiles(expected, opt.outputDir, t)
  })
})

test('output of single svg', function(t) {
  t.plan(3)

  var expected = ['test.mermaid.svg']

  opt = clone(singleFile)
  opt.svg = true

  mermaid.process(opt.files, opt, function(code) {
    t.equal(code, 0, 'has clean exit code')

    verifyFiles(expected, opt.outputDir, t)
  })
})

test('output of multiple svg', function(t) {
  t.plan(3)

  var expected = ['test.mermaid.svg', 'test2.mermaid.svg']

  opt = clone(multiFile)
  opt.svg = true

  mermaid.process(opt.files, opt, function(code) {
    t.equal(code, 0, 'has clean exit code')

    verifyFiles(expected, opt.outputDir, t)
  })
})

function verifyFiles(expected, dir, t) {
  async.each(
      expected
    , function(file, cb) {
        filename = path.join(dir, path.basename(file))
        fs.stat(filename, function(err, stat) {
          cb(err)
        })
      }
    , function(err) {
        t.notOk(err, 'all files passed')

        rimraf(dir, function(rmerr) {
          t.notOk(rmerr, 'cleaned up')
          t.end()
        })
      }
  )
}
