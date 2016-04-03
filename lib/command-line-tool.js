'use strict'
var arrayify = require('array-back')
var ansi = require('ansi-escape-sequences')
var t = require('typical')
var where = require('test-value').cb

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
exports.halt = halt
exports.options = options
exports.usage = ''

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

  if (options.displayUsage) console.error(exports.usage)
  process.exit(0)
}

/**
 * Display an error message
 *
 * @param {string | Error} - the error message or instance
 * @param [options] {object}
 * @static
 */
function error (err, options) {
  options = options || {}

  /* detect whether operational or programmer error, and display stack if latter */
  console.error(ansi.format(t.isString(err) ? err : err.stack, 'red'))
}

/**
 * Stop the process with an error message
 *
 * @param {string | Error} - the error message or instance
 * @param [options] {object}
 * @param [options.usage] {boolean} - display usage
 * @param [options.exitCode] {number} - defaults to 1
 * @static
 */
function halt (err, options) {
  options = options || {}
  if (!t.isDefined(options.exitCode)) options.exitCode = 1

  error(err)

  if (err.code === 'EPIPE') process.exit(0) /* no big deal */
  if (options.usage) console.error(options.usage)
  process.exit(options.exitCode)
}

function options (definitions, usageOptions) {
  definitions = arrayify(definitions)
  if (!definitions.some(where({ name: 'help '}))) {
    definitions.push({
      name: 'help',
      alias: 'h',
      type: Boolean,
      description: 'Print usage information'
    })
  }
  var commandLineArgs = require('command-line-args')
  var cli = commandLineArgs(definitions)
  exports.usage = cli.getUsage(usageOptions)
  var opts
  try {
    opts = cli.parse()
  } catch (err) {
    halt(err.message)
  }
  if (opts.help) {
    stop(null, { displayUsage: true })
  }
  return opts
}
