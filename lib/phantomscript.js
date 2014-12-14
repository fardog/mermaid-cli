/*global phantom:true*/
/*global require:true*/

/*
phantom args
[0] - output directory path
[1] - should we write pngs?
[ ] - files
*/
phantom.onError = function(msg, trace) {
  var msgStack = ['PHANTOM ERROR: ' + msg]
  if (trace && trace.length) {
    msgStack.push('TRACE:')
    trace.forEach(function(t) {
      msgStack.push(
          ' -> '
        + (t.file || t.sourceURL)
        + ': '
        + t.line
        + (t.function ? ' (in function ' + t.function +')' : '')
      )
    })
  }
  system.stderr.write(msgStack.join('\n'))
  phantom.exit(1)
}

var system = require('system')
  , fs = require('fs')
  , webpage = require('webpage')

var mermaid = require('mermaid')

var page = webpage.create()
  , files = phantom.args.slice(2, phantom.args.length)
  , options = {
        outputDir: phantom.args[0]
      , png: phantom.args[1]
    }

files.forEach(function(file) {
  var contents = fs.read(file)
    , filename = file.split(fs.separator).slice(-1)
    , svgContent

  page.content = [
      '<html>'
    , '<head>'
    , '<style type="text/css">'
    , '* { margin: 0; padding: 0; }'
    , '</style>'
    , '</head>'
    , '<body>'
    , '</body>'
    , '</html>'
  ].join('\n')

  page.injectJs('../node_modules/mermaid/dist/mermaid.full.js')

  svgContent = page.evaluate(function(contents) {
    var xmlSerializer = new XMLSerializer()
      , el
      , elContent
      , svg
      , svgValue

    el = document.createElement("div")
    el.className = 'mermaid'
    elContent = document.createTextNode(contents)
    el.appendChild(elContent)

    document.body.appendChild(el)

    mermaid.init()

    svg = document.querySelector('svg')
    svgValue = xmlSerializer.serializeToString(svg)

    return svgValue
  }, contents)

  // TODO: there are many things that could go wrong here
  if (options.png === 'true') {
    var oParser = new DOMParser()
      , oDOM = oParser.parseFromString(svgContent, "text/xml")

    page.viewportSize = {
        width: ~~oDOM.documentElement.attributes.getNamedItem('width').value
      , height: ~~oDOM.documentElement.attributes.getNamedItem('height').value
    }

    page.render(options.outputDir + fs.separator + filename + '.png')
  }
  system.stdout.write(
      String.fromCharCode(1)
    + filename
    + String.fromCharCode(2)
  )
  system.stdout.write(
      svgContent
    + String.fromCharCode(3)
  )
})

system.stdout.write(String.fromCharCode(4))

phantom.exit()
