'use strict'
const arrayify = require('array-back')
const ansi = require('ansi-escape-sequences')

exports.stop = stop

function stop (msgs, exitCode) {
  arrayify(msgs).forEach(msg => {
    if (msg instanceof Error) {
      const err = msg
      if (err.code === 'EPIPE') process.exit(0) /* no big deal */
      console.error(ansi.format(msg.stack, exitCode > 0 ? 'red' : ''))
    } else {
      console.error(ansi.format(msg, exitCode > 0 ? 'red' : ''))
    }
  })
  // console.error(usage)
  process.exit(exitCode)
}
