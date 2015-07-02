# Decode Presentations

Source code for presentations used in Decode lessons. Powered by [Debut](https://github.com/getdecoded/debut)
and [Jekyll](http://jekyllrb.com).

## Building

First install things

    npm install -g gulp # Build tool
    npm install # Node dependencies
    bundle install # Ruby dependencies (for Jekyll)

To just build the thing

    gulp build

To start a server with live reloading of assets

    gulp

### Presentations

As there could be a large number of presentations with different assets, by default these
aren't watched or rebuilt in the default watch mode. Each presentation has its own `main.less`
and `main.js` file which can include anything it needs. To watch a presentation and load changes for it,
which will be necessary when creating a presentation, pass the `--pres` argument set to
the path to the presentation. e.g.

    gulp --pres=general/intro/02-events

## License

The MIT License (MIT)

Copyright (c) 2015 Decode

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.