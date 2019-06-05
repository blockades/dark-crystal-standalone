const pull = require('pull-stream')
const { h, Array: MutantArray, map, throttle } = require('mutant')

module.exports = function CrystalsIndex (opts) {
  const {
    scuttle,
    showCrystal,
    newCrystal
  } = opts

  const roots = getRoots()

  return h('DarkCrystalCrystalsIndex', [
    h('div.new', { title: 'Create a new Dark Crystal' }, [
      h('div.overview', { 'ev-click': () => newCrystal() }, [
        h('i.fa.fa-plus.fa-lg')
      ])
    ]),
    map(roots, Root, { comparer })
  ])

  function Root (msg) {
    const { value: { timestamp, content: { name } } } = msg
    const date = new Date(timestamp).toLocaleDateString()
    return h('div.crystal', [
      h('div.overview', { title: `${name} - ${date}`, 'ev-click': () => showCrystal({ root: msg }) }, [
        h('div.name', name),
        h('div.started', date)
      ])
    ])
  }

  function getRoots () {
    const store = MutantArray([])

    pull(
      scuttle.root.pull.mine({ live: true }),
      pull.filter(m => !m.sync),
      pull.drain(root => store.insert(root, 0))
    )
    return throttle(store, 100)
  }
}

function comparer (a, b) {
  return a && b && a.key === b.key
}
