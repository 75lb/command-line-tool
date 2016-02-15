'use strict'
var arrayify = require('array-back')
var ansi = require('ansi-escape-sequences')
var t = require('typical')

/**
 * Some conventional operations used in command-line tools.
 *
 * @module command-line-tool
 * @typicalname tool
 * @example
 * const tool = require('command-line-tool')
 */
exports.stop = stop
exports.error = error


/**
 * Stop the process with the supplied exit code.
 *
 * @param {number} - the exit code
 * @param [options] {object}
 * @param [options.message] {string|string[]} - One or more messages to be written to stderr before exiting. If the exit code is greater than 0 they will be formatted red.
 * @param [options.usage] {string} - Usage guidance, written to stderr without additional formatting.
 * @static
 */
function stop (message, options) {
  options = options || {}
  arrayify(message).forEach(function (msg) {
    console.error(ansi.format(msg))
  })

  if (options.usage) console.error(options.usage)
  process.exit(0)
}

/**
 * Stop the process with an error message
 *
 * @param {string | Error} - the error message or instance
 * @param [options] {object}
 * @param [options.usage] {string} - Usage guidance, written to stderr without additional formatting.
 * @param [options.exitCode] {number} - defaults to 1
 * @static
 */
 function error (err, options) {
  options = options || {}
  if (!t.isDefined(options.exitCode)) options.exitCode = 1
  if (t.isString(err)) err = new Error(err)

  if (err.code === 'EPIPE') process.exit(0) /* no big deal */

  /* detect whether operational or programmer error, and display stack if latter */
  console.error(ansi.format(err.stack, 'red'))

  if (options.usage) console.error(options.usage)
  process.exit(options.exitCode)
}
