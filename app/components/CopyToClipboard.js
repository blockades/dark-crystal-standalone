const { h, Value, when, resolve } = require('mutant')
const { clipboard } = require('electron')

const Tooltip = require('./Tooltip')

module.exports = function CopyToClipboard (props = {}, children = []) {
  const {
    value = Value(),
    size = 'small'
  } = props

  const state = {
    copying: Value(false)
  }

  const sizes = {
    small: 'fa-lg',
    medium: 'fa-2x',
    large: 'fa-3x'
  }

  return h('div.copy', [
    h('i.fa.fa-clipboard', {
      classList: [sizes[size]],
      'ev-click': () => {
        state.copying.set(true)

        try {
          clipboard.write(resolve(value))
        } catch (err) {
          console.log(err)
        } finally {
          setTimeout(() => {
            state.copying.set(false)
          }, 500)
        }
      }
    }),
    when(state.copying,
      Tooltip({ text: 'Copied to clipboard' })
    )
  ])
}
