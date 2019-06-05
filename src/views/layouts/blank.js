const nest = require('depnest')
const { h } = require('mutant')

exports.gives = nest('views.layouts.blank')

exports.create = (api) => {
  return nest('views.layouts.blank', layoutBlank)

  function layoutBlank (request, children = []) {
    return [
      ...children
    ]
  }
}
