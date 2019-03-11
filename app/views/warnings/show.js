const nest = require('depnest')
const { h } = require('mutant')

exports.gives = nest('app.views.warnings.show')
exports.needs = nest({
  'message.async.publish': 'first',
  'sbot.obs.connection': 'first',
  'router.sync.goTo': 'first'
})

exports.create = (api) => {
  return nest('app.views.warnings.show', warningShow)

  function warningShow (request) {
    return h('Warnings -show', [
      h('h1', 'Warning! Are you sure you want to do this... This is some undoable stuff...')
    ])
  }
}
