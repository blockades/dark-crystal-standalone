const { h, Struct, Value, Array: MutantArray, computed, when, watch, resolve } = require('mutant')
const Recipients = require('../component/recipients')
const Errors = require('../component/errors')

const MIN_RECPS = 2

module.exports = function CrystalsNew (opts) {
  const {
    scuttle,
    suggest,
    name,
    avatar,
    onSubmit = console.log,
    onCancel = console.log
  } = opts

  const initialState = {
    crystalName: '', // name is a reserved key in mutant!
    label: '',
    secret: '',
    recps: MutantArray([]),
    quorum: undefined,
    showErrors: false,
    performingRitual: false
  }
  const state = Struct(initialState)

  const errors = Struct({
    validation: computed(state, checkForErrors),
    ritual: Value()
  })
  watch(errors.validation, errors => {
    if (!Object.keys(errors).length) state.showErrors.set(false)
  })

  return h('DarkCrystalCrystalsNew', [
    h('h1', 'New Dark Crystal'),
    h('section.inputs', [
      h('div.name', [
        h('label.name', 'Name'),
        h('input.name', {
          placeholder: 'a short name for this crystal',
          value: state.crystalName,
          'ev-input': ev => state.crystalName.set(ev.target.value)
        })
      ]),
      h('div.label', [
        h('label.label', 'label'),
        h('input.label', {
          placeholder: 'a more detailed description for future you / family who might recover this',
          value: state.label,
          'ev-input': ev => state.label.set(ev.target.value)
        })
      ]),
      h('div.secret', [
        h('label', 'Secret'),
        h('textarea', {
          placeholder: 'your secret',
          value: state.secret,
          'ev-input': ev => state.secret.set(ev.target.value)
        })
      ]),
      h('div.recps', [
        h('label.recps', 'Custodians'),
        Recipients({ state, suggest, name, avatar, placeholder: 'those you trust to guard your secret' })
      ]),
      h('div.quorum', [
        h('label.quorum', 'Quorum'),
        h('input.quorum', {
          type: 'number',
          min: MIN_RECPS,
          steps: 1,
          value: state.quorum,
          placeholder: 'number of shards recover',
          'ev-input': ev => state.quorum.set(Number(ev.target.value) || undefined)
        })
      ])
    ]),
    h('section.errors', [
      h('div.errors', [
        when(state.showErrors,
          h('div.error.-validation', [
            Errors('The following fields are required:', errors.validation)
          ])
        ),
        when(errors.ritual,
          h('div.error.-ritual', [
            Errors('Something went wrong:', errors.ritual)
          ])
        )
      ])
    ]),
    h('section.actions', when(state.performingRitual,
      h('i.fa.fa-spinner.fa-pulse'),
      [
        h('button -subtle', { 'ev-click': () => { state.set(initialState); onCancel() } }, 'Cancel'),
        when(errors.validation,
          h('button -subtle', { 'ev-click': () => state.showErrors.set(true) }, 'Submit'),
          h('button -primary', { 'ev-click': () => performRitual(state) }, 'Submit')
        )
      ]
    ))
  ])

  function performRitual (state) {
    const { crystalName: name, label, secret, recps, quorum } = resolve(state)

    state.performingRitual.set(true)

    scuttle.share.async.share({ name, label, secret, recps, quorum }, (err, data) => {
      if (err) {
        state.performingRitual.set(false)
        errors.ritual.set(err)
        return
      }

      onSubmit(err, data)
      state.set(initialState)
    })
  }
}

function checkForErrors ({ crystalName, label, secret, recps, quorum }) {
  const MAX_LENGTH = 1350
  const err = {}
  if (!crystalName) err.name = 'required'
  if (typeof label !== 'string') err.label = 'label must be string'
  if (!secret) err.secret = 'required'
  if (secret.length + label.length > MAX_LENGTH) err['secret + label'] = `combined length must be less (${MAX_LENGTH - secret.length - label.length})`
  if (recps.length < MIN_RECPS) err.custodians = `you need to offer at least ${MIN_RECPS}`
  if (recps.length < quorum) err.quorum = 'you need more custodians, or a lower quorum.'
  if (quorum !== Math.floor(quorum)) err.quorum = 'must be a whole number' // will over-write the above message

  if (Object.keys(err).length) return err
  else return false
}
