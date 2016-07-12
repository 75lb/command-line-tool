'use strict'
const arrayify = require('array-back')
const ansi = require('ansi-escape-sequences')
const t = require('typical')
const where = require('test-value').where

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
  constructor () {
    this.usage = null
  }
  /**
   * Stop the process with the supplied exit code.
   *
   * @param {number} - the exit code
   * @param [options] {object}
   * @param [options.message] {string|string[]} - One or more messages to be written to stderr before exiting. If the exit code is greater than 0 they will be formatted red.
   */
  stop (message) {
    arrayify(message).forEach(function (msg) {
      console.error(ansi.format(msg))
    })
    process.exit(0)
  }

  /**
   * Display an error message
   *
   * @param {string | Error} - the error message or instance
   * @param [options] {object}
   * @param [options.stack] {boolean} - defaults to false
   */
  printError (err, options) {
    options = options || {}
    const msg = t.isString(err) ? err : options.stack ? err.stack : err.message
    console.error(ansi.format(msg, 'red'))
  }

  /**
   * Stop the process with an error message
   *
   * @param {string | Error} - the error message or instance
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
        this.printError(err, options)
      }
    }
    process.exit(options.exitCode)
  }

  /**
   *
   */
  getOptions (definitions, usageSections) {
    definitions = arrayify(definitions)
    const commandLineArgs = require('command-line-args')
    const commandLineUsage = require('command-line-usage')

    this.usage = commandLineUsage(usageSections)
    let options
    try {
      options = commandLineArgs(definitions)
    } catch (err) {
      this.printError(err.name === 'UNKNOWN_OPTION' ? err.message : err)
      console.error(this.usage)
      this.halt()
    }
    return options
  }
}

module.exports = CommandLineTool
