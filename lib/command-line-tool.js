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
   */
  printError (err) {
    /* detect whether operational or programmer error, and display stack if latter */
    console.error(ansi.format(t.isString(err) ? err : err.stack, 'red'))
  }

  /**
   * Stop the process with an error message
   *
   * @param {string | Error} - the error message or instance
   * @param [options] {object}
   * @param [options.exitCode] {number} - defaults to 1
   */
  halt (err, { exitCode = 1 } = {}) {
    if (err) {
      if (err.code === 'EPIPE') {
        process.exit(0) /* no big deal */
      } else {
        this.printError(err)
      }
    }
    process.exit(exitCode)
  }

  /**
   *
   */
  getOptions (definitions, usageSections) {
    definitions = arrayify(definitions)
    if (!definitions.some(where({ name: 'help' }))) {
      definitions.push({
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print usage information.'
      })
    }
    const commandLineArgs = require('command-line-args')
    const commandLineUsage = require('command-line-usage')

    this.usage = commandLineUsage(usageSections)
    let options
    try {
      options = commandLineArgs(definitions)
    } catch (err) {
      this.printError(err.message)
      console.error(this.usage)
      this.halt()
    }
    if (options.help || (options._all && options._all.help)) {
      this.stop(this.usage)
    }
    return options
  }
}

module.exports = CommandLineTool
