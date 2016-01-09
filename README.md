[![view on npm](http://img.shields.io/npm/v/command-line-tool.svg)](https://www.npmjs.org/package/command-line-tool)
[![npm module downloads per month](http://img.shields.io/npm/dm/command-line-tool.svg)](https://www.npmjs.org/package/command-line-tool)
[![Build Status](https://travis-ci.org/75lb/command-line-tool.svg?branch=master)](https://travis-ci.org/75lb/command-line-tool)
[![Dependency Status](https://david-dm.org/75lb/command-line-tool.svg)](https://david-dm.org/75lb/command-line-tool)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

<a name="module_command-line-tool"></a>
## command-line-tool
Some conventional operations used in command-line tools.

**Example**  
```js
const tool = require('command-line-tool')
```
<a name="module_command-line-tool.stop"></a>
### tool.stop(exitCode, [options])
Stop the process with the supplied exit code.

**Kind**: static method of <code>[command-line-tool](#module_command-line-tool)</code>  

| Param | Type | Description |
| --- | --- | --- |
| exitCode | <code>number</code> | the exit code |
| [options] | <code>object</code> |  |
| [options.message] | <code>string</code> &#124; <code>string</code> | One or more messages to be written to stderr before exiting. If the exit code is greater than 0 they will be formatted red. |
| [options.usage] | <code>string</code> | Usage guidance, written to stderr without additional formatting. |


* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
