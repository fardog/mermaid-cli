# mermaid-cli

Render [mermaid chart description][mermaid] files to png or svg.

**Warning:** This is a very early release; not everything may work as expected.
PNG output works pretty well, but isn't thoroughly tested. SVGs can be output,
but are and are non-standard and text labels are imperfect.

## Installation

Install the module globally to expose the `mermaid` command to your environment.

```bash
npm install -g mermaid-cli
```

## Usage

```
$ mermaid --help

Usage: mermaid [options] <file>...

file    The mermaid description file to be rendered

Options:
  -s --svg          Output SVG instead of PNG (experimental)
  -p --png          If SVG was selected, and you also want PNG, set this flag
  -o --outputDir    Directory to save files, will be created automatically, defaults to `cwd`
  -h --help         Show this message
  -v --verbose      Show logging
  --version         Print version and quit
```
## History

- **v0.2.0**  
Pretty good PNG output, rudimentary SVG output

- **v0.1.0**  
Simplify SVG output, default to PNG

- **v0.0.1**  
Functional PNG support.

- **v0.0.0**  
Early release.

[mermaid]: https://github.com/knsv/mermaid/

## The MIT License (MIT)

Copyright (c) 2014 Nathan Wittstock

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
