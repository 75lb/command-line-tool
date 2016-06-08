'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var arrayify = require('array-back');
var ansi = require('ansi-escape-sequences');
var t = require('typical');
var where = require('test-value').where;

var CommandLineTool = function () {
  function CommandLineTool() {
    _classCallCheck(this, CommandLineTool);

    this.usage = null;
  }

  _createClass(CommandLineTool, [{
    key: 'stop',
    value: function stop(message) {
      arrayify(message).forEach(function (msg) {
        console.error(ansi.format(msg));
      });
      process.exit(0);
    }
  }, {
    key: 'printError',
    value: function printError(err) {
      console.error(ansi.format(t.isString(err) ? err : err.stack, 'red'));
    }
  }, {
    key: 'halt',
    value: function halt(err) {
      var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref$exitCode = _ref.exitCode;
      var exitCode = _ref$exitCode === undefined ? 1 : _ref$exitCode;

      if (err.code === 'EPIPE') {
        process.exit(0);
      } else {
          this.printError(err);
          process.exit(exitCode);
        }
    }
  }, {
    key: 'getOptions',
    value: function getOptions(definitions, usageSections) {
      definitions = arrayify(definitions);
      if (!definitions.some(where({ name: 'help' }))) {
        definitions.push({
          name: 'help',
          alias: 'h',
          type: Boolean,
          description: 'Print usage information.'
        });
      }
      var commandLineArgs = require('command-line-args');
      var commandLineUsage = require('command-line-usage');

      this.usage = commandLineUsage(usageSections);
      var options = void 0;
      try {
        options = commandLineArgs(definitions);
      } catch (err) {
        this.printError(err.message);
        console.error(this.usage);
        this.halt();
      }
      if (options.help || options._all && options._all.help) {
        this.stop(this.usage);
      }
      return options;
    }
  }]);

  return CommandLineTool;
}();

module.exports = CommandLineTool;