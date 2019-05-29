module.exports = function Tooltip ({ targetElement, text, position }) {
  return h('div.Tooltip', {
    attributes: {
      'data-tooltip': text,
      'data-tooltip-position': position
    }
  })
}
