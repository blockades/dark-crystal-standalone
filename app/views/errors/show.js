const nest = require('depnest')
const { h } = require('mutant')

exports.gives = nest('app.views.errors.show')
exports.needs = nest({
  'message.async.publish': 'first',
  'sbot.obs.connection': 'first',
  'router.sync.goTo': 'first'
})

exports.create = (api) => {
  return nest('app.views.errors.show', errorsShow)

  function errorsShow (request) {
    const { error } = request

    return h('Errors -show', [
      h('div.error', [
        h('div.message', error.message),
      ])
    ])
  }
}
