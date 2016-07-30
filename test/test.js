var test = require('tape')
var tool = require('../')

test('.getCli', function(t){
  var definitions = [
    { name: 'yeah', type: String }
  ]
  var sections = [
    { header: 'Yeah', content: 'Test' }
  ]
  var cli = tool.getCli(definitions, sections, [ '--yeah', 'test' ])
  t.deepEqual(cli.options, { yeah: 'test' })
  t.ok(/Test/.test(cli.usage))
  t.end()
})
