module.exports = function Tabs (state) {

}

function Tabs (state) {
  return computed(state.tab, tab => {
    return h('div.tabs', [
      h('div.tab',
        tab === DETAILS ? { className: '-selected' } : { 'ev-click': () => state.tab.set(DETAILS) },
        [ DETAILS ]
      ),
      h('div.tab',
        tab === SHARDS ? { className: '-selected' } : { 'ev-click': () => state.tab.set(SHARDS) },
        [ SHARDS ]
      ),
      when(state.quorumMet,
        h('div.tab',
          tab === SECRET ? { className: '-selected' } : { 'ev-click': () => state.tab.set(SECRET) },
          [ SECRET ]
        ),
        null
      )
    ])
  })
}

