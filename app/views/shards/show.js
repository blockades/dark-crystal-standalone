const nest = require('depnest')
const { h, computed, Value } = require('mutant')

const Backward = require('../../components/Backward')

exports.gives = nest('app.views.shards.show')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
})

exports.create = (api) => {
  return nest('app.views.shards.show', shardsShow)

  function shardsShow (request, children = []) {
    const state = {
      ...request.shard
    }

    return h('Shards -show', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.container', [
        JSON.stringify(state)
      ])
    ])
  }
}
