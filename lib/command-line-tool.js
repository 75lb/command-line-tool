'use strict'
var arrayify = require('array-back')
var ansi = require('ansi-escape-sequences')

/**
 * Some conventional operations used in command-line tools.
 *
 * @module command-line-tool
 * @typicalname tool
 * @example
 * const tool = require('command-line-tool')
 */
exports.stop = stop

/**
 * Stop the process with the supplied exit code.
 *
 * @param {number} - the exit code
 * @param [options] {object}
 * @param [options.message] {string|string} - One or more messages to be written to stderr before exiting. If the exit code is greater than 0 they will be formatted red.
 * @param [options.usage] {string} - Usage guidance, written to stderr without additional formatting.
 * @static
 */
function stop (exitCode, options) {
  options = options || {}
  arrayify(options.message).forEach(function (msg) {
    if (msg instanceof Error) {
      var err = msg
      if (err.code === 'EPIPE') process.exit(0) /* no big deal */
      console.error(ansi.format(msg.stack, exitCode > 0 ? 'red' : ''))
    } else {
      console.error(ansi.format(msg, exitCode > 0 ? 'red' : ''))
    }
  })

  if (options.usage) console.error(options.usage)
  process.exit(exitCode)
}
