const { h, computed, Value, Array: MutantArray } = require('mutant')

module.exports = function Slider (props = {}, children = []) {
  const {
    collection = MutantArray([]),
    min = 2,
    max,
    title,
    value = Value(),
    required = false
  } = props

  const state = { value }

  const slider = (collection) => {
    var currentLength = typeof collection === 'function'
    ? collection.getLength()
    : collection.length

    return h('div.slider', [
      h('input', {
        'ev-input': (e) => (
          (e.target.value / 100) >= min
          ? state.value.set(Math.round(e.target.value / 100))
          : null
        ),
        title,
        type: 'range',
        min,
        max: (max * 100) || (currentLength * 100),
        attributes: { value: computed(state.value, value => value > min ? value * 100 : min * 100) }
      }),
      h('span', computed(state.value, value => value > min ? value : min))
    ])
  }

  return h('div.slider', [
    typeof collection === 'function'
    ? computed(collection, slider)
    : slider(collection),
    ...children
  ])
}

function capitalize (str) {
  return str.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}
