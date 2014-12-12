/*global phantom:true*/
/*global require:true*/

/*
phantom args
[0] - input directory path
[1] - output directory path
[2] - default width
[3] - default height
*/

var system = require('system')
  , fs = require('fs')
  , webpage = require('webpage')

var mermaid = require('mermaid')

var page = webpage.create()

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
};

var options = {
    input: phantom.args[0]
  , output: phantom.args[1]
}

var contents = fs.read(options.input)

page.content = "<body></body>"

page.evaluate(function(contents) {
  var el
    , elContent

  el = document.createElement("div")
  el.className = 'mermaid'
  elContent = document.createTextNode(contents)
  el.appendChild(elContent)

  document.body.appendChild(el)
}, contents)

page.render('output.png')

phantom.exit()
