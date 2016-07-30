'use strict';

var arrayify = require('array-back');
var ansi = require('ansi-escape-sequences');

exports.stop = stop;
exports.printError = printError;
exports.halt = halt;
exports.getCli = getCli;

function stop(message) {
  arrayify(message).forEach(function (msg) {
    console.error(ansi.format(msg));
  });
  process.exit(0);
}

function printError(message) {
  arrayify(message).forEach(function (msg) {
    console.error(ansi.format(msg, 'red'));
  });
}

function halt(err, options) {
  options = Object.assign({ exitCode: 1 }, options);
  if (err) {
    if (err.code === 'EPIPE') {
      process.exit(0);
    } else {
      var t = require('typical');
      this.printError(t.isString(err) ? err : options.stack ? err.stack : err.message, options);
    }
  }
  process.exit(options.exitCode);
}

function getCli(definitions, usageSections, argv) {
  var commandLineArgs = require('command-line-args');
  var commandLineUsage = require('command-line-usage');
  var usage = usageSections ? commandLineUsage(usageSections) : '';
  var options = commandLineArgs(definitions, argv);
  return { options: options, usage: usage };
}