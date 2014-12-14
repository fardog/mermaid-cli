# mermaid-cli

Render [mermaid chart description][mermaid] files to png or svg.

**Warning:** This is a very early release not yet fit for public consumption.
PNGs seem to work pretty well, but aren't tested thoroughly and there are few
options.  SVGs are output, but are and are non-standard and missing labels.

## Installation

Install the module globally to expose the `mermaid` command to your environment.

```bash
npm install -g mermaid-cli
```

## Usage

```
$ mermaid --help
```
## History

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
