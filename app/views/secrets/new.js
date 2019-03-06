const nest = require('depnest')
const { h, computed, Array: MutantArray, map, Struct } = require('mutant')

exports.gives = nest('app.views.secrets.new')

exports.needs = nest({
  'app.actions.secrets.new': 'first',
  'router.sync.goBack': 'first',
  'about.html.avatar': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.new', secretsNew)

  function secretsNew (request) {
    // can we define this elsewhere...?
    const state = Struct({
      secretName: null,
      secret: null,
      recps: MutantArray([]),
      quorum: null,
      image: null
    })

    return h('Secrets -new', [
      h('section.form', [
        h('div.name', { title: 'Enter a name for your reference only' }, [
          h('label.name', 'Name'),
          h('input.name', { placeholder: 'For your reference only (this is private)' })
        ]),
        h('div.secret', { title: 'Enter the secret / key you wish to back-up' }, [
          h('label.secret', 'Secret'),
          h('textarea.name', { placeholder: 'Enter the secret / key you wish to back-up' })
        ]),
        h('div.custodians', [
          h('label.custodians', 'Custodians'),
          map(state.recps, recp => (
            h('div.custodian', [
              api.about.html.avatar(recp),
              h('span.name', recp.name)
            ])
          ))
        ]),
        computed(state.recps, recps => (
          h('div.quorum', { title: 'Choose a quorum of custodians required to reassemble the secret' }, [
            h('label.quorum', 'Quorum'),
            h('input.quorum', { type: 'range', min: 2, max: recps.length }),
            h('span.quorum', recps.length)
          ])
        ))
      ])
    ])
  }
}

