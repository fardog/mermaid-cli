/**
 * Credits:
 * - SVG Processing from the NYTimes svg-crowbar, under an MIT license
 *   https://github.com/NYTimes/svg-crowbar
 * - Thanks to the grunticon project for some guidance
 *   https://github.com/filamentgroup/grunticon
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

function logger(_verbose) {
  var verbose = _verbose

  return function(_message, _level) {
    var level = level
      , message = _message

    log = level === 'error' ? system.stderr : system.stdout

    if (verbose) {
      log.write(message)
    }
  }
}

var system = require('system')
  , fs = require('fs')
  , webpage = require('webpage')

var page = webpage.create()
  , files = phantom.args.slice(4, phantom.args.length)
  , options = {
        outputDir: phantom.args[0]
      , png: phantom.args[1]
      , svg: phantom.args[2]
      , verbose: phantom.args[3]
    }
  , log = logger(options.verbose)

files.forEach(function(file) {
  var contents = fs.read(file)
    , filename = file.split(fs.separator).slice(-1)
    , oParser = new DOMParser()
    , oDOM
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

  // this JS is sandboxed, even though it doesn't look like it. we need to
  // serialize then unserialize the svgContent that's taken from the DOM
  svgContent = page.evaluate(function(contents) {
    var xmlSerializer = new XMLSerializer()
      , prefix = {
            xmlns: "http://www.w3.org/2000/xmlns/"
          , xlink: "http://www.w3.org/1999/xlink"
          , svg: "http://www.w3.org/2000/svg"
        }
      , doctype = '<!DOCTYPE svg:svg PUBLIC'
          + ' "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN"'
          + ' "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">'
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
    svg.setAttribute("version", "1.1")
    // removing attributes so they aren't doubled up
    svg.removeAttribute("xmlns")
    svg.removeAttribute("xlink")
    // These are needed for the svg
    if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
      svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg)
    }
    if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
      svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink)
    }

    svgValue = xmlSerializer.serializeToString(svg)

    return doctype + svgValue
  }, contents)

  function traverse(obj){
    var tree = [];
    tree.push(obj);
    visit(obj);
    function visit(node) {
      if (node && node.hasChildNodes()) {
        var child = node.firstChild;
        while (child) {
          if (child.nodeType === 1 && child.nodeName != 'SCRIPT'){
            tree.push(child);
            visit(child);
          }
          child = child.nextSibling;
        }
      }
    }
    return tree;
  }

  function resolveForeignObjects(element) {
    var children

    if (element.tagName === 'foreignObject') {
      bodyEl = document.createElement('body')
      bodyEl.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
      if (element.hasChildNodes()) {
        children = element.childNodes
        for (var i = 0; i < children.length; i++) {
          bodyEl.appendChild(children[i])
        }
      }
      element.appendChild(bodyEl)
    }
  }

  oDOM = oParser.parseFromString(svgContent, "text/xml")

  var allElements = traverse(oDOM);
  var i = allElements.length;
  while (i--){
    resolveForeignObjects(allElements[i]);
  }

  // TODO: there are many things that could go wrong here
  if (options.png === 'true') {

    page.viewportSize = {
        width: ~~oDOM.documentElement.attributes.getNamedItem('width').value
      , height: ~~oDOM.documentElement.attributes.getNamedItem('height').value
    }

    page.render(options.outputDir + fs.separator + filename + '.png')
  }

  if (options.svg === 'true') {
    var serialize = new XMLSerializer()
    fs.write(
        filename + '.svg'
      , serialize.serializeToString(oDOM)
      , 'w'
    )
  }
})

phantom.exit()
