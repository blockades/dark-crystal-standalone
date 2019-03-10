const { h, computed, Value } = require('mutant')

module.exports = function Slider (props = {}, children = []) {
  const {
    collection = [],
    min = 2,
    max,
    title,
    fieldName = '',
    required = false
  } = props

  const state = {
    value: Value(min)
  }

  const slider = (collection) => {
    var currentLength = typeof collection === 'function'
    ? collection.getLength()
    : collection.length

    return h('section', { classList: [fieldName], title }, [
      h('label', { classList: [fieldName] }, capitalize(fieldName)),
      h('div.slider', [
        h('input', {
          'ev-input': (ev) => state.value.set(Math.round(ev.target.value / 100)),
          classList: [fieldName],
          title,
          type: 'range',
          min,
          max: (max * 100) || (currentLength * 100),
          attributes: { value: computed(state.value, value => value > min ? value * 100 : min * 100) }
        }),
        h('span', { classList: [fieldName] }, computed(state.value, value => value > min ? value : min))
      ])
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
