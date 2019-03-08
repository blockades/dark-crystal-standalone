const { h, Array: MutantArray, resolve } = require('mutant')

const AddPeer = require('./AddPeer')

module.exports = function Search (props, children = []) {
  const { suggest, routeTo } = props
  const state = {
    feed: MutantArray([])
  }

  return h('div.search', [
    h('i.fa.fa-search.fa-lg'),
    AddPeer({
      suggest,
      peers: state.feed,
      max: 1,
      onSubmit: () => {
        const id = resolve(state.feed)[0].link
        routeTo({ path: `/peers/${id}`, peer: { id } })
      }
    })
  ])

}
