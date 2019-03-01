const nest = require('depnest')
const requireStyle = require('require-style')

exports.gives = nest('styles.css')

exports.create = function (api) {
  return nest('styles.css', css)

  function css (acc = {}) {
    return Object.assign(acc, {
      'font-awesome': requireStyle('font-awesome')
    })
  }
}
