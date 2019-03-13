const { h, computed } = require('mutant')
const ColourHash = require('color-hash')

module.exports = function Avatar (props = {}, children = []) {
  const {
    id,
    size,
    onClick = noop,
    imageUrl = identity,
  } = props

  const colourHash = new ColourHash()

  return computed(imageUrl(id), (src) => (
    h('div.img', { title: id, style: { padding: `0 0 0 ${size / 8}rem` } }, [
      h('img', {
        src,
        classList: ['Avatar'],
        style: {
          height: isNaN(size) ? size : `${size}rem`,
          width: isNaN(size) ? size : `${size}rem`,
          'background-color': src.match(/^http/) ? 'rgba(0,0,0,0)' : colourHash.hex(id)
        },
        'ev-click': onClick
      })
    ])
  ))
}

function noop () {}
function identity (id) { return id }
