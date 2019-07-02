const { h, Array: MutantArray, resolve } = require('mutant')

const { isFeedId } = require('ssb-ref')
const AddPeer = require('./AddPeer')

module.exports = function Search (props = {}, children = []) {
  const { suggest, secrets, routeTo, myId } = props
  const state = {
    selected: MutantArray([])
  }

  return h('div.search', [
    h('i.fa.fa-search.fa-lg'),
    AddPeer({
      suggest,
      secrets,
      selected: state.selected,
      max: 1,
      canClear: false,
      onSubmit: () => {
        const record = resolve(state.selected)[0]
        if (record.id === myId) routeTo({ path: `/settings/account` })
        else if (isFeedId(record.id)) routeTo({ path: `/peers/${record.id}`, peer: { id: record.id } })
        else routeTo({ path: `/secrets/${record.id}`, secret: record })
      }
    }, [ h('div') ])
  ])
}
