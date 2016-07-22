'use strict'
const arrayify = require('array-back')
const ansi = require('ansi-escape-sequences')
const t = require('typical')

/**
 * Some conventional operations used in command-line tools.
 *
 * @module command-line-tool
 * @example
 * const CommandLineTool = require('command-line-tool')
 */

/**
 * @alias module:command-line-tool
 * @typicalname tool
 */
class CommandLineTool {

  /**
   * Print the supplied messages then stop the process (no exit code).
   *
   * @param [message] {string|string[]} - One or more messages to be written to stderr before exiting. May contain `ansi.format` markup.
   */
  stop (message) {
    arrayify(message).forEach(function (msg) {
      console.error(ansi.format(msg))
    })
    process.exit(0)
  }

  /**
   * Prints one or more strings in red to stderr.
   *
   * @param {string | string[]} - input message(s)
   */
  printError (message) {
    arrayify(message).forEach(function (msg) {
      console.error(ansi.format(msg, 'red'))
    })
  }

  /**
   * Stop the process with an error message.
   *
   * @param [err] {Error} - the error instance
   * @param [options] {object}
   * @param [options.exitCode] {number} - defaults to 1
   * @param [options.stack] {boolean} - defaults to false
   */
  halt (err, options) {
    options = Object.assign({ exitCode: 1 }, options)
    if (err) {
      if (err.code === 'EPIPE') {
        process.exit(0) /* no big deal */
      } else {
        this.printError(options.stack ? err.stack : err, options)
      }
    }
    process.exit(options.exitCode)
  }

  /**
   * Parse the command-line options.
   * @param {OptionDefinitions[]} - to be passed to command-line-args
   * @param {section[]} - to be passed to command-line-usage
   * @returns {object}
   */
  getOptions (definitions, usageSections) {
    definitions = arrayify(definitions)
    const commandLineArgs = require('command-line-args')
    const commandLineUsage = require('command-line-usage')

    const usage = commandLineUsage(usageSections)
    let options
    try {
      options = commandLineArgs(definitions)
    } catch (err) {
      this.printError(err.name === 'UNKNOWN_OPTION' ? err.message : err)
      console.error(usage)
      this.halt()
    }
    return { options, usage }
  }
}

module.exports = CommandLineTool
