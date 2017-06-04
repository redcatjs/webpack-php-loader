# php loader for webpack

This package will load any php content and use php to turn it into a html page.

Ex:

## Installation

`npm install php-loader`

## Usage

``` javascript
var fileContent = require("php!./file.php");
// => run file.php with php and return it as some content (html for example)
```

It can also be used inside the webpack configuration file (webpack.js):


``` javascript
module.exports = {
  ...
  module: {
    loaders: [
      ...
      {
        test: /\.php$/,
        loaders: [
          'html-minify',
          'php-loader'
        ]
      },
      ...
    ]
  },
  ...
}
```

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

## Configuration

Here is a list of the available configuration options:

- proxy: set the name of a proxy script to be used as a loader for the resource
- args: list of string to be added as arguments to the proxy (or php) script
- dependancies: list of glob pattern of files on which the resource depend
- debug: add depandancies as html comment in the output (this will modify the output of the php script, and can lead to invalid results)

example usage:

```javascript
         loaders: [
          'php-loader?' + JSON.stringify({
            proxy: 'router.php',
            args: [ '--arg1=no' ],
            dependancies: [
              __dirname + '/www/api/v1.0/app/**/*.php',
              __dirname + '/www/templates/**/*.php'
            ],
            debug: true
          })
        ]

```

In this case, the command to be executed by php-loader to get the file 'resource.php' will be:
```bash
  php router.php --arg1=no resource.php

```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
