const { h, Array: MutantArray, resolve } = require('mutant')

const AddPeer = require('./AddPeer')

module.exports = function Search (props = {}, children = []) {
  const { suggest, routeTo, myId } = props
  const state = {
    feed: MutantArray([])
  }

  return h('div.search', [
    h('i.fa.fa-search.fa-lg'),
    AddPeer({
      suggest,
      peers: state.feed,
      max: 1,
      canClear: true,
      onSubmit: () => {
        const { link: id } = resolve(state.feed)[0]
        if (id === myId) routeTo({ path: `/settings/account` })
        else routeTo({ path: `/peers/${id}`, peer: { id } })
      }
    })
  ])

}
